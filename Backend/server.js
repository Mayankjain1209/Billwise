import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './services/prisma.js';

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
      'http://localhost:3000',
      'https://billwise-dd2v.vercel.app',
      'https://billwise-dd2v-fmj946mca-mayank-tanks-projects-724a7fcd.vercel.app',
      /https:\/\/billwise-.*\.vercel\.app$/
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

// Handle preflight requests
app.options('*', cors());

/* ===================== BODY PARSERS ===================== */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* ===================== REQUEST LOGGER ===================== */
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

/* ===================== HEALTH CHECK ===================== */
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      environment: process.env.NODE_ENV || 'development'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error.message
    });
  }
});

/* ===================== ROUTES ===================== */
app.use('/api/auth', authRoutes);
app.use('/api/bills', billsRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/ai', aiRoutes);

/* ===================== 404 HANDLER ===================== */
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

/* ===================== ERROR HANDLER ===================== */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

/* ===================== SERVER ===================== */
/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 8080; // Railway uses dynamic PORT

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Server is ready to accept connections`);
});
```

---

## **CORRECTED: RAILWAY ENVIRONMENT VARIABLES**

Go to Railway → Your Billwise Backend Service → Variables Tab

**DO NOT ADD PORT VARIABLE** - Railway sets this automatically!

Only add these variables:
```
DATABASE_URL
postgresql://neondb_owner:npg_GLgpok8fhIEH@ep-icy-shadow-a1wf61ps-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

DIRECT_URL
postgresql://neondb_owner:npg_GLgpok8fhIEH@ep-icy-shadow-a1wf61ps.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

JWT_SECRET
supersecretkey

GEMINI_API_KEY
AIzaSyCggr1e9oPiXAA1ZgFQBru7WBjZXEBms3x4

NODE_ENV
production