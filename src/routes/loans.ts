import express from 'express';
import { db, notifyClients } from '../server';
import { Bank, Loan } from '../types';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const loans = db.get('loans').value();
    res.json(loans);
  } catch (error) {
    console.error('Error al obtener préstamos:', error);
    res.status(500).json({ error: 'Error al obtener los préstamos' });
  }
});

router.patch('/:id', (req, res) => {
  const loanId = parseInt(req.params.id);
  try {
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

    db.write();
    notifyClients();

    res.json({ message: 'Préstamo actualizado' });
  } catch (error) {
    console.error('Error al actualizar préstamo:', error);
    res.status(500).json({ error: 'Error al actualizar el préstamo' });
  }
});

export default router;