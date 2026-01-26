# BillWise.com - Quick Start

## 🚀 Fast Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Set up database:**
   - Create PostgreSQL database: `CREATE DATABASE billwise;`
   - Copy `backend/.env.example` to `backend/.env`
   - Update DATABASE_URL with your PostgreSQL credentials

3. **Run migrations:**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start servers:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🎯 First Steps

1. Register a new account at `/register`
2. Go to Dashboard (`/dashboard`)
3. Upload a dummy bill:
   - Select bill type (Electricity, Hospital, etc.)
   - Enter amount (e.g., 2500)
   - Add custom instruction: "Explain like I'm 10"
   - Click Upload
4. View the AI-generated explanation
5. Explore other features:
   - `/expenses` - View expense analytics
   - `/chat` - Chat with AI about bills
   - `/learn` - Bill literacy resources

## 📝 Mock AI Features

The application uses a **rule-based mock AI** that:
- Generates explanations based on bill type
- Detects potential scams (randomized for demo)
- Identifies optional charges
- Responds to custom instructions (Hindi, "explain like I'm 10", etc.)
- Provides chat responses based on keywords

## 🎨 Design System

- **Background**: Soft cream (#fdf8f4)
- **Primary Color**: Orange (#ff5a0a)
- **Style**: Bill.com-inspired, professional fintech look
- **Language**: English + Hindi support

## 🔑 Key Features

✅ Bill upload and analysis  
✅ Scam detection alerts  
✅ Expense tracking with charts  
✅ AI Chat interface  
✅ Multi-language (EN/HI)  
✅ Bill comparison analytics  
✅ Secure authentication  

## 🐛 Common Issues

**Database connection error:**
- Check PostgreSQL is running
- Verify DATABASE_URL in `backend/.env`

**Port already in use:**
- Change PORT in `backend/.env`
- Update proxy in `frontend/vite.config.js`

**Prisma errors:**
- Run `npx prisma generate` in backend folder

## 📚 Full Documentation

See `SETUP.md` for detailed setup instructions.
