import express from 'express';
import prisma from "../services/prisma.js";
import { authenticateToken } from '../middleware/auth.js';
import { chatWithGemini } from '../services/geminiAI.js';

const router = express.Router();

router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    // Get the user's latest bill to give context to the AI
    const latestBill = await prisma.bill.findFirst({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });

    // Call Gemini Chat
    const reply = await chatWithGemini(
      message,
      latestBill
        ? {
            type: latestBill.type,
            amount: latestBill.amount,
            date: latestBill.date
          }
        : null
    );

    res.json({ response: reply });

  } catch (error) {
    console.error('CHAT ROUTE ERROR:', error);
    res.status(500).json({ 
      error: 'Chat failed',
      message: error.message
    });
  }
});

export default router;