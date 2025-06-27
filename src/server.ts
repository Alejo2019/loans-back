import express from 'express';
import jsonServer from 'json-server';
import usersRouter from './routes/users';
import loansRouter from './routes/loans';
import bankRouter from './routes/bank';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  },
});

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

export const db = jsonServer.router('db.json').db;
export const notifyClients = () => {
  try {
    io.emit('dataUpdated', db.getState());
  } catch (error) {
    console.error('Error al enviar notificación WebSocket:', error);
  }
};

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log('Estado inicial de db.json:', db.getState());
});

export default app;