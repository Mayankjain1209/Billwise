import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.js';
import billsRoutes from './routes/bills.js';
import expensesRoutes from './routes/expenses.js';
import aiRoutes from './routes/ai.js';

dotenv.config();

const app = express();

/* ===================== CORS ===================== */
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://billwise-dd2v.vercel.app',
    ],
    credentials: true,
  })
);

/* ===================== BODY PARSERS ===================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== HEALTH CHECK ===================== */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

/* ===================== ROUTES ===================== */
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/ai', aiRoutes);

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
