import express from 'express';
import jsonServer from 'json-server';
import { Bank } from '../types/indesx';


const router = express.Router();
const db = jsonServer.router('db.json').db;

// Obtener el capital del banco
router.get('/', (req, res) => {
  const bank: Bank = db.get('bank').value();
  res.json(bank);
});

// Actualizar el capital del banco
router.patch('/', (req, res) => {
  const { capital } = req.body;
  db.get('bank').assign({ capital }).write();
  res.json({ capital });
});

export default router;