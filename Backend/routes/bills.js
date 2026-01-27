import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeBillWithGemini } from '../services/geminiAI.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all bills for the user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ bills });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Upload and Analyze Bill
router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { type, amount, date, fileName, userInstruction } = req.body;

    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 1. Call Gemini AI to analyze the bill
    const analysis = await analyzeBillWithGemini(
      { type, amount, date },
      userInstruction
    );

    // 2. Save Bill to Database
    const bill = await prisma.bill.create({
      data: {
        userId: req.user.userId,
        type,
        amount: Number(amount),
        date: new Date(date),
        fileName: fileName || 'demo-bill',
        explanation: analysis.explanation,
        scamAlerts: JSON.stringify(analysis.scamAlerts),
        optionalCharges: JSON.stringify(analysis.optionalCharges),
        metadata: JSON.stringify(analysis)
      }
    });

    // 3. Automatically add to Expenses
    await prisma.expense.create({
      data: {
        userId: req.user.userId,
        billId: bill.id,
        type,
        amount: Number(amount),
        date: new Date(date),
        description: `Bill: ${type}`
      }
    });

    res.status(201).json({ bill });

  } catch (err) {
    console.error('UPLOAD ERROR:', err);
    res.status(500).json({ error: 'Bill upload failed' });
  }
});

export default router;
