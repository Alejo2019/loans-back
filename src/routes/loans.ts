import express from 'express';
import jsonServer from 'json-server';
import { Bank, Loan } from '../types/indesx';


const router = express.Router();
const db = jsonServer.router('db.json').db;

// Listar todos los préstamos
router.get('/', (req, res) => {
  const loans = db.get('loans').value();
  res.json(loans);
});

// Pagar un préstamo
router.patch('/:id', (req, res) => {
  const loanId = parseInt(req.params.id);
  const loan: Loan = db.get('loans').find({ id: loanId }).value();

  if (!loan) {
    return res.status(404).json({ error: 'Préstamo no encontrado' });
  }

  if (req.body.hasPaid) {
    const bank: Bank = db.get('bank').value();
    db.get('bank').assign({ capital: bank.capital + loan.amount }).write();
    db.get('loans').find({ id: loanId }).assign({ hasPaid: true }).write();
    db.get('users')
      .find({ idCard: loan.userId })
      .assign({ hasPaid: true })
      .write();
  }

  res.json({ message: 'Préstamo actualizado' });
});

export default router;