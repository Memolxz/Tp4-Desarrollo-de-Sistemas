import "dotenv/config";
import cors from 'cors';
import express from 'express';

import { userRouter } from './routers/user-router';
import { registerRouter } from './routers/register-router';
import { loginRouter } from './routers/login-router';
import { eventRouter } from './routers/event-router';
import { attendanceRouter } from './routers/attendance-router';
import { purchaseRouter } from './routers/purchase-router';
import { imageRouter } from './routers/image-router';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cors());

app.use('/register', registerRouter);
app.use('/login', loginRouter);
app.use('/users', userRouter);
app.use('/events', eventRouter);
app.use('/events', imageRouter);
app.use('/attendance', attendanceRouter);
app.use('/purchases', purchaseRouter);

app.listen(8000, () => {
  console.log(`Migueventos API listening on http://localhost:8000`);
});