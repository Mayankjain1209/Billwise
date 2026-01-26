import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const { user, logout } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  // Smart Scroll: Hide on scroll down, show on scroll up
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) { 
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // --- STYLES ---
  // Home Page: Dark Gradient + Glassy Blur
  // Other Pages: Light White + Glassy Blur
  const navClasses = isHomePage 
    ? "bg-gradient-to-r from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-md border-b border-white/10 text-white shadow-lg shadow-black/20"
    : "bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-sm";

  const linkBaseClasses = "font-medium transition-colors duration-200";
  const linkClasses = isHomePage
    ? `${linkBaseClasses} text-slate-300 hover:text-white`
    : `${linkBaseClasses} text-slate-600 hover:text-indigo-600`;

  return (
    <>
      <nav 
        className={`fixed w-full z-50 top-0 transition-transform duration-300 ease-in-out ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        } ${navClasses}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className={`text-2xl font-bold tracking-tight ${isHomePage ? 'text-white' : 'text-slate-900'}`}>
                BillWise.com
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className={linkClasses}>{t('home')}</Link>
              
              {user && (
                <>
                  <Link to="/dashboard" className={linkClasses}>{t('dashboard')}</Link>
                  <Link to="/expenses" className={linkClasses}>{t('expenses')}</Link>
                </>
              )}
              
              <Link to="/learn" className={linkClasses}>{t('learn')}</Link>
              
              {user && (
                <Link to="/chat" className={`${linkClasses} flex items-center space-x-1`}>
                  <MessageCircle size={18} />
                  <span>{t('chat')}</span>
                </Link>
              )}

              {/* Language Toggle */}
              <div className={`flex items-center space-x-2 border-l pl-4 ${isHomePage ? 'border-white/20' : 'border-slate-200'}`}>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : isHomePage ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => changeLanguage('hi')}
                  className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
                    language === 'hi'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30'
                      : isHomePage ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-100'
                  }`}
                >
                  HI
                </button>
              </div>

              {/* Auth Buttons */}
              {user ? (
                <button
                  onClick={handleLogout}
                  className={`px-4 py-2 rounded-lg border transition-all font-medium ${
                    isHomePage 
                      ? 'bg-white/10 border-white/10 text-white hover:bg-white/20' 
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-indigo-600'
                  }`}
                >
                  {t('logout')}
                </button>
              ) : (
                <>
                  <Link to="/login" className={linkClasses}>{t('login')}</Link>
                  <Link
                    to="/dashboard"
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all font-medium shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
                  >
                    {t('getStarted')}
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 transition-colors ${isHomePage ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 space-y-3 border-t backdrop-blur-xl ${
            isHomePage ? 'bg-slate-900/95 border-white/10' : 'bg-white/95 border-slate-100'
          }`}>
            <Link to="/" className={`block px-4 py-2 ${linkClasses}`} onClick={() => setMobileMenuOpen(false)}>{t('home')}</Link>
            {user && (
              <>
                <Link to="/dashboard" className={`block px-4 py-2 ${linkClasses}`} onClick={() => setMobileMenuOpen(false)}>{t('dashboard')}</Link>
                <Link to="/expenses" className={`block px-4 py-2 ${linkClasses}`} onClick={() => setMobileMenuOpen(false)}>{t('expenses')}</Link>
                <Link to="/chat" className={`block px-4 py-2 ${linkClasses}`} onClick={() => setMobileMenuOpen(false)}>{t('chat')}</Link>
              </>
            )}
            <Link to="/learn" className={`block px-4 py-2 ${linkClasses}`} onClick={() => setMobileMenuOpen(false)}>{t('learn')}</Link>
            
            {user ? (
               <div className="px-4 pt-2">
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium">
                    {t('logout')}
                  </button>
               </div>
            ) : (
               <div className="space-y-3 px-4 pt-2">
                 <Link to="/login" className={`block text-center px-4 py-2 ${linkClasses}`} onClick={() => setMobileMenuOpen(false)}>{t('login')}</Link>
                 <Link to="/dashboard" className="block text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md" onClick={() => setMobileMenuOpen(false)}>{t('getStarted')}</Link>
               </div>
            )}
          </div>
        )}
      </nav>
      {/* Spacer for non-home pages */}
      {!isHomePage && <div className="h-16" />}
    </>
  );
};

export default Navbar;