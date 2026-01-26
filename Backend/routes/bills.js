import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { analyzeBill } from '../services/mockAI.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all bills
router.get('/', authenticateToken, async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      include: { expenses: true }
    });

    res.json({ bills });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Upload bill (MOCK UPLOAD)
router.post('/upload', authenticateToken, async (req, res) => {
  try {
    const { type, fileName, amount, date, userInstruction, language } = req.body;

    // ✅ REQUIRED ONLY THESE
    if (!type || !amount || !date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const safeFileName = fileName || 'demo-bill';

    // Mock AI
    const analysis = analyzeBill(
      { type, amount: Number(amount), date: new Date(date) },
      userInstruction || '',
      language || 'en'
    );

    const bill = await prisma.bill.create({
      data: {
        userId: req.user.userId,
        type,
        fileName: safeFileName,
        amount: Number(amount),
        date: new Date(date),
        explanation: analysis.explanation,
        scamAlerts: JSON.stringify(analysis.scamAlerts),
        optionalCharges: JSON.stringify(analysis.optionalCharges),
        metadata: JSON.stringify(analysis)
      }
    });

    await prisma.expense.create({
      data: {
        userId: req.user.userId,
        billId: bill.id,
        type,
        amount: Number(amount),
        date: new Date(date),
        description: `${type} bill`
      }
    });

    res.status(201).json({
      message: 'Bill uploaded successfully',
      bill: {
        ...bill,
        analysis
      }
    });
  } catch (error) {
    console.error('UPLOAD ERROR:', error);
    res.status(500).json({ error: 'Failed to upload bill' });
  }
});

export default router;
