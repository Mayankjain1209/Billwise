import express from 'express';
import prisma from "../services/prisma.js";
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// 1. GET Expenses Summary (Charts & Cards)
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const { period, type } = req.query;
    const userId = req.user.userId;

    const now = new Date();
    let startDate = new Date();

    // Calculate Date Range based on 'period' dropdown
    if (period === 'weekly') {
      startDate.setDate(now.getDate() - 7);
    } else if (period === 'monthly') {
      startDate.setMonth(now.getMonth() - 1);
    } else if (period === 'quarterly') {
      startDate.setMonth(now.getMonth() - 3);
    } else if (period === 'yearly') {
      startDate.setFullYear(now.getFullYear() - 1);
    } else {
      startDate.setMonth(now.getMonth() - 1); // Default
    }

    // Build the "Where" Filter
    const whereClause = {
      userId,
      date: { gte: startDate },
      ...(type && type !== 'all' ? { type } : {})
    };

    // Fetch data for charts
    const expenses = await prisma.expense.findMany({
      where: whereClause,
      orderBy: { date: 'asc' }
    });

    // Calculate Totals
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const count = expenses.length;
    const average = count > 0 ? total / count : 0;

    // Group for "By Month" Chart
    const byMonth = expenses.reduce((acc, curr) => {
      const month = new Date(curr.date).toLocaleString('default', { month: 'short' });
      acc[month] = (acc[month] || 0) + curr.amount;
      return acc;
    }, {});

    // Group for "By Type" Chart
    const byType = expenses.reduce((acc, curr) => {
      acc[curr.type] = (acc[curr.type] || 0) + curr.amount;
      return acc;
    }, {});

    res.json({
      summary: { total, count, average },
      byMonth,
      byType
    });

  } catch (error) {
    console.error('Summary Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch summary',
      message: error.message
    });
  }
});

// 2. GET All Expenses (For the Table List)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { type, limit } = req.query;
    
    // Filter by User AND Type (if selected)
    const where = {
      userId: req.user.userId,
      ...(type && type !== 'all' ? { type } : {})
    };

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit ? parseInt(limit) : undefined,
      include: {
        bill: {
          select: {
            fileName: true
          }
        }
      }
    });

    res.json({ expenses });
  } catch (error) {
    console.error('List Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch expenses',
      message: error.message
    });
  }
});

export default router;