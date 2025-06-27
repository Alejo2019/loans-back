import express from 'express';
import jsonServer from 'json-server';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import loanRoutes from './routes/loans';
import bankRoutes from './routes/bank';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const initialBankCapital = parseInt(process.env.INITIAL_BANK_CAPITAL || '1000000');
const dbPath = 'db.json';
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(
    dbPath,
    JSON.stringify({ users: [], loans: [], bank: { capital: initialBankCapital } }, null, 2)
  );
} else {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
  if (!dbData.bank || typeof dbData.bank.capital !== 'number') {
    dbData.bank = { capital: initialBankCapital };
    fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
  }
}

app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

const router = jsonServer.router('db.json');
app.use('/api/db', router);

app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/bank', bankRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});