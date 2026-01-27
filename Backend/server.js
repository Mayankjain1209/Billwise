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
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'BillWise API is running' });
});

// Start server
app.listen(PORT, async () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  
  // Check environment variables
  console.log('\n📋 Environment Check:');
  console.log('- Gemini API Key:', process.env.GEMINI_API_KEY ? '✅ Loaded' : '❌ Missing');
  console.log('- Port:', PORT);
  
  // Test Gemini connection on startup
  if (process.env.GEMINI_API_KEY) {
    console.log('\n🧪 Testing Gemini API connection...');
    const result = await testGeminiConnection();
    if (result.success) {
      console.log('✅ Gemini API is working correctly');
    } else {
      console.log('❌ Gemini API test failed:', result.error);
    }
  } else {
    console.log('\n⚠️  Warning: GEMINI_API_KEY not found in .env file');
  }
  
  console.log('\n✨ BillWise API is ready!\n');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});