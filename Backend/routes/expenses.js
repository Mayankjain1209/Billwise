import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get expense summary
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { period = 'monthly', startDate, endDate } = req.query;
    const userId = req.user.userId;

    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        date: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      };
    }

    const expenses = await prisma.expense.findMany({
      where: {
        userId,
        ...dateFilter
      },
      orderBy: { date: 'desc' }
    });

    // Calculate summary
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    
    // Group by type
    const byType = expenses.reduce((acc, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
      return acc;
    }, {});

    // Group by month
    const byMonth = expenses.reduce((acc, exp) => {
      const month = new Date(exp.date).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + exp.amount;
      return acc;
    }, {});

    res.json({
      summary: {
        total,
        count: expenses.length,
        average: expenses.length > 0 ? total / expenses.length : 0
      },
      byType,
      byMonth,
      expenses: expenses.slice(0, 50) // Limit for response size
    });
  } catch (error) {
    console.error('Error fetching expense summary:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all expenses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, limit = 100 } = req.query;
    const where = {
      userId: req.user.userId,
      ...(type && { type })
    };

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit),
      include: {
        bill: {
          select: {
            id: true,
            fileName: true,
            type: true
          }
        }
      }
    });

    res.json({ expenses });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;