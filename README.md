# BillWise.com

**Bills explained like a human, not a lawyer.**

A full-stack fintech application for analyzing, understanding, and tracking bills using AI-powered insights.

## Features

- 📄 **Bill Analysis**: Upload bills and get human-readable explanations
- 🛡️ **Scam Detection**: Identify suspicious charges and overbilling
- 📊 **Expense Tracking**: Visual analytics and month-to-month comparisons
- 💬 **AI Chat**: Interactive chat about your bills
- 🌐 **Multi-language**: English and Hindi support
- 🔒 **Secure Authentication**: JWT-based user authentication

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- React Router
- Chart.js
- Lucide React

### Backend
- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT Authentication
- Mock AI Engine

## Setup

1. Install dependencies:
```bash
npm run install:all
```

2. Set up PostgreSQL database and configure `.env` in backend folder

3. Run database migrations:
```bash
cd backend
npx prisma migrate dev
```

4. Start development servers:
```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3000

## Project Structure

```
BillWise/
├── frontend/          # React frontend application
├── backend/           # Express backend API
└── README.md
```
