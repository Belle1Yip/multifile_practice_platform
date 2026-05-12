import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import problemRoutes from './routes/problem';
import judgeRoutes from './routes/judge';
import aiRoutes from './routes/ai';
import examRoutes from './routes/exam';
import importRoutes from './routes/import';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/judge', judgeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/import', importRoutes);

app.get('/', (req, res) => {
  res.json({ message: '欢迎使用编程学习在线评测平台 API' });
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});