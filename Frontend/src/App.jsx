import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/footer'; // Import the Footer component
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Learn from './pages/Learn';
import Chat from './pages/Chat';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Router>
          {/* Changed div structure to ensure sticky footer */}
          <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            
            {/* Main content grows to fill space, pushing footer down */}
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/expenses"
                  element={
                    <PrivateRoute>
                      <Expenses />
                    </PrivateRoute>
                  }
                />
                <Route path="/learn" element={<Learn />} />
                <Route
                  path="/chat"
                  element={
                    <PrivateRoute>
                      <Chat />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>

            {/* Footer added here */}
            <Footer />
          </div>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;