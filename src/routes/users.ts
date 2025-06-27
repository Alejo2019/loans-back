import express from 'express';
import jsonServer from 'json-server';
import { User, Bank, Loan } from '../types/indesx';

const router = express.Router();
const db = jsonServer.router('db.json').db;

// Crear un nuevo usuario y solicitud de préstamo
router.post('/', (req, res) => {
  const user: User = req.body;
  const existingUser = db.get('users').find({ idCard: user.idCard }).value();

  // Validar si el usuario ya existe
  if (existingUser) {
    if (existingUser.loanStatus === 'rejected') {
      return res.status(400).json({ error: 'Usuario rechazado previamente' });
    }
    if (!existingUser.hasPaid) {
      return res.status(400).json({ error: 'Usuario con préstamo pendiente' });
    }
  }

  // Lógica de aprobación aleatoria (solo para nuevos usuarios)
  const isApproved = existingUser ? true : Math.random() > 0.5;
  user.loanStatus = isApproved ? 'approved' : 'rejected';

  // Actualizar capital del banco si el préstamo es aprobado
  if (isApproved) {
    const bank: Bank = db.get('bank').value();
    if (bank.capital >= user.loanAmount) {
      db.get('bank').assign({ capital: bank.capital - user.loanAmount }).write();
    } else {
      return res.status(400).json({ error: 'Capital insuficiente' });
    }
  }

  // Guardar usuario
  db.get('users').push({ ...user, id: Date.now() }).write();

  // Guardar préstamo
  const loan: Loan = {
    userId: user.idCard,
    amount: user.loanAmount,
    status: user.loanStatus,
    hasPaid: false,
    paymentDate: user.paymentDate,
    id: Date.now(),
  };
  db.get('loans').push(loan).write();

  res.status(201).json(user);
});

// Listar todos los usuarios
router.get('/', (req, res) => {
  const users = db.get('users').value();
  res.json(users);
});

export default router;