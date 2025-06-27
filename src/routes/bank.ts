import express from 'express';
import { db, notifyClients } from '../server';
import { Bank } from '../types';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const bank: Bank = db.get('bank').value();
    res.json(bank);
  } catch (error) {
    console.error('Error al obtener el banco:', error);
    res.status(500).json({ error: 'Error al obtener el capital del banco' });
  }
});

router.patch('/', (req, res) => {
  const { capital } = req.body;
  try {
    db.get('bank').assign({ capital }).write();
    db.write();
    notifyClients();

    res.json({ capital });
  } catch (error) {
    console.error('Error al escribir en db.json:', error);
    res.status(500).json({ error: 'Error al actualizar el capital del banco' });
  }
});

export default router;