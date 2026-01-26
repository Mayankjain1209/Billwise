import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';
import { generateChatResponse } from '../services/mockAI.js';


const router = express.Router();
const prisma = new PrismaClient();


// Chat endpoint
router.post('/chat', authenticateToken, async (req, res) => {
  try {
    const { message, language = 'en' } = req.body;


    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }


    // Get user's latest bill for context
    const latestBill = await prisma.bill.findFirst({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' }
    });


    const billContext = latestBill ? {
      amount: latestBill.amount,
      type: latestBill.type,
      date: latestBill.date
    } : null;


    // Generate response using mock AI
    const response = generateChatResponse(message, billContext, language);


    res.json({
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Explain bill endpoint
router.post('/explain', authenticateToken, async (req, res) => {
  try {
    const { billId, instruction, language = 'en' } = req.body;


    const bill = await prisma.bill.findFirst({
      where: {
        id: billId,
        userId: req.user.userId
      }
    });


    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }


    // Re-analyze with new instruction
    const { analyzeBill } = await import('../services/mockAI.js');
    const analysis = analyzeBill(
      {
        type: bill.type,
        amount: bill.amount,
        date: bill.date
      },
      instruction || '',
      language
    );


    // Update bill with new explanation
    const updatedBill = await prisma.bill.update({
      where: { id: billId },
      data: {
        explanation: analysis.explanation,
        scamAlerts: JSON.stringify(analysis.scamAlerts),
        optionalCharges: JSON.stringify(analysis.optionalCharges)
      }
    });


    res.json({
      bill: updatedBill,
      analysis
    });
  } catch (error) {
    console.error('Error explaining bill:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;




