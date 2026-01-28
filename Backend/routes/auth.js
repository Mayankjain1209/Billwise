import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from "../services/prisma.js";


const router = express.Router();
const prisma = new PrismaClient();


// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }


    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });


    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });


    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }


    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });


    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);


    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }


    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );


    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];


    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });


    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }


    res.json({ user });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});


export default router;



