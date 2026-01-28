import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import billRoutes from './routes/bills.js';
import expenseRoutes from './routes/expenses.js';
import aiRoutes from './routes/ai.js';
import { testGeminiConnection } from './services/geminiAI.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BillWise API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BillWise API is running' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development'
      ? err.message
      : 'Something went wrong'
  });
});

// ✅ ALWAYS start server (Railway requires this)
app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Optional startup checks (safe to keep)
  console.log('\n📋 Environment Check:');
  console.log('- Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Missing');

  if (process.env.GEMINI_API_KEY) {
    console.log('\n🧪 Testing Gemini API connection...');
    const result = await testGeminiConnection();
    if (result.success) {
      console.log('✅ Gemini API is working correctly');
    } else {
      console.log('❌ Gemini API test failed:', result.error);
    }
  }
});
