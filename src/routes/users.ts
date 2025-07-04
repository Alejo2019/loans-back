import express, { Request, Response } from 'express';
import { db, notifyClients } from '../server';
import { User, Bank, Loan } from '../types';

const router = express.Router();

router.post('/', (req: Request, res: Response) => {
  const user: User = req.body;
  try {
    if (!user.idCard || !user.loanAmount || !user.name || !user.email) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const existingUser = db.get('users').find({ idCard: user.idCard }).value();
    if (existingUser) {
      if (existingUser.loanStatus === 'rejected') {
        return res.status(400).json({ error: 'Usuario rechazado previamente' });
      }
      const activeLoan = db.get('loans').find({ userId: user.idCard, hasPaid: false }).value();
      if (activeLoan) {
        return res.status(400).json({ error: 'Usuario con préstamo pendiente' });
      }
    }

    const isApproved = existingUser ? true : Math.random() > 0.333;
    user.loanStatus = isApproved ? 'approved' : 'rejected';

    if (isApproved) {
      const bank: Bank = db.get('bank').value();
      if (bank.capital >= user.loanAmount) {
        const newCapital = bank.capital - user.loanAmount;
        db.get('bank').assign({ capital: newCapital }).write();
      } else {
        return res.status(400).json({ error: 'Capital insuficiente' });
      }
    }

    const newUser = { ...user, id: Date.now(), hasPaid: false };
    db.get('users').push(newUser).write();

    const loan: Loan = {
      id: Date.now(),
      userId: user.idCard,
      amount: user.loanAmount,
      status: user.loanStatus,
      hasPaid: false,
      paymentDate: user.paymentDate || new Date().toISOString().split('T')[0],
    };
    db.get('loans').push(loan).write();

    db.write();
    notifyClients();


    res.status(201).json({ user: newUser, loanStatus: user.loanStatus });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

router.get('/', (req: Request, res: Response) => {
  try {
    const users = db.get('users').value();
    res.json(users);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

export default router;