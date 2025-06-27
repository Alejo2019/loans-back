import express from 'express';
import jsonServer from 'json-server';
import { Bank } from '../types';

const router = express.Router();
const db = jsonServer.router('db.json').db;

router.patch('/', (req, res) => {
  console.log('Ruta /bank PATCH recibida');
  const { capital } = req.body;
  try {
    db.get('bank').assign({ capital }).write();
    console.log('Capital del banco actualizado:', db.get('bank').value());
    db.write();
    console.log('Estado de db.json tras escritura:', db.getState());
    res.json({ capital });
  } catch (error) {
    console.error('Error al escribir en db.json:', error);
    res.status(500).json({ error: 'Error al actualizar el capital del banco' });
  }
});

router.patch('/', (req, res) => {
  console.log('Ruta /bank PATCH recibida');
  const { capital } = req.body;
  db.get('bank').assign({ capital }).write();
  console.log('Capital del banco actualizado:', db.get('bank').value());

  db.write();
  console.log('Estado de db.json tras escritura:', db.getState());

  res.json({ capital });
});

export default router;