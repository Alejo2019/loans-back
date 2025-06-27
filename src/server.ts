import express from 'express';
import jsonServer from 'json-server';
import usersRouter from './routes/users';
import loansRouter from './routes/loans';
import bankRouter from './routes/bank';

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/users', usersRouter);
app.use('/api/loans', loansRouter);
app.use('/api/bank', bankRouter);

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './public',
});

app.use(middlewares);
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  router(req, res, next);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Estado inicial de db.json:', jsonServer.router('db.json').db.getState());
});

export default app;