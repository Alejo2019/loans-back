import express, { Request, Response } from 'express';
import jsonServer from 'json-server';
import { User, Bank, Loan } from '../types/index';

const router = express.Router();
const db = jsonServer.router('db.json').db;

router.post('/', (req: Request, res: Response) => {
  console.log('Ruta /users POST recibida');
  const user: User = req.body;
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
      console.log('Capital actualizado a:', newCapital);
    } else {
      return res.status(400).json({ error: 'Capital insuficiente' });
    }
  }

  const newUser = { ...user, id: Date.now() };
  db.get('users').push(newUser).write();
  console.log('Usuario guardado:', newUser);

  const loan: Loan = {
    id: Date.now(),
    userId: user.idCard,
    amount: user.loanAmount,
    status: user.loanStatus,
    hasPaid: false,
    paymentDate: user.paymentDate,
  };
  db.get('loans').push(loan).write();
  console.log('Préstamo guardado:', loan);

  db.write();
  console.log('Estado de db.json tras escritura:', db.getState());

  res.status(201).json({ user: newUser, loanStatus: user.loanStatus });
});

router.get('/', (req: Request, res: Response) => {
  console.log('Ruta /users GET recibida');
  const users = db.get('users').value();
  res.json(users);
});

export default router;