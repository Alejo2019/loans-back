import express from 'express';
import jsonServer from 'json-server';
import { Bank, Loan } from '../types';

const router = express.Router();
const db = jsonServer.router('db.json').db;

router.get('/', (req, res) => {
  console.log('Ruta /loans GET recibida');
  const loans = db.get('loans').value();
  res.json(loans);
});

router.patch('/:id', (req, res) => {
  console.log('Ruta /loans PATCH recibida');
  const loanId = parseInt(req.params.id);
  const loan: Loan = db.get('loans').find({ id: loanId }).value();

  if (!loan) {
    return res.status(404).json({ error: 'Préstamo no encontrado' });
  }

  if (req.body.hasPaid) {
    const bank: Bank = db.get('bank').value();
    db.get('bank').assign({ capital: bank.capital + loan.amount }).write();
    console.log('Capital del banco actualizado:', db.get('bank').value());
    db.get('loans').find({ id: loanId }).assign({ hasPaid: true }).write();
    console.log('Préstamo actualizado:', db.get('loans').find({ id: loanId }).value());
    db.get('users')
      .find({ idCard: loan.userId })
      .assign({ hasPaid: true })
      .write();
    console.log('Usuario actualizado:', db.get('users').find({ idCard: loan.userId }).value());
  }

  db.write();
  console.log('Estado de db.json tras escritura:', db.getState());

  res.json({ message: 'Préstamo actualizado' });
});

export default router;