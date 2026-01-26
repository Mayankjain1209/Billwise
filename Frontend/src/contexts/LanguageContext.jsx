import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Navigation
    home: 'Home',
    dashboard: 'Dashboard',
    expenses: 'Expenses',
    learn: 'Bill Literacy',
    chat: 'AI Chat',
    getStarted: 'Get Started',
    login: 'Login',
    logout: 'Logout',
    
    // Common
    upload: 'Upload',
    analyze: 'Analyze',
    explain: 'Explain',
    compare: 'Compare',
    bills: 'Bills',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    
    // Dashboard
    uploadBill: 'Upload Bill',
    billType: 'Bill Type',
    howToExplain: 'How would you like this bill to be explained?',
    explanation: 'Explanation',
    scamAlerts: 'Scam Alerts',
    optionalCharges: 'Optional Charges',
    suggestions: 'Suggestions',
    
    // Expenses
    totalExpenses: 'Total Expenses',
    byType: 'By Type',
    byMonth: 'By Month',
    
    // Auth
    email: 'Email',
    password: 'Password',
    name: 'Name',
    register: 'Register',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
  },
  hi: {
    // Navigation
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    expenses: 'खर्चे',
    learn: 'बिल साक्षरता',
    chat: 'AI चैट',
    getStarted: 'शुरू करें',
    login: 'लॉगिन',
    logout: 'लॉगआउट',
    
    // Common
    upload: 'अपलोड करें',
    analyze: 'विश्लेषण करें',
    explain: 'समझाएं',
    compare: 'तुलना करें',
    bills: 'बिल',
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    
    // Dashboard
    uploadBill: 'बिल अपलोड करें',
    billType: 'बिल प्रकार',
    howToExplain: 'आप इस बिल को कैसे समझाना चाहेंगे?',
    explanation: 'व्याख्या',
    scamAlerts: 'धोखाधड़ी चेतावनी',
    optionalCharges: 'वैकल्पिक शुल्क',
    suggestions: 'सुझाव',
    
    // Expenses
    totalExpenses: 'कुल खर्चे',
    byType: 'प्रकार के अनुसार',
    byMonth: 'महीने के अनुसार',
    
    // Auth
    email: 'ईमेल',
    password: 'पासवर्ड',
    name: 'नाम',
    register: 'रजिस्टर करें',
    alreadyHaveAccount: 'पहले से खाता है?',
    dontHaveAccount: 'खाता नहीं है?',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem('language') || 'en'
  );

  const t = (key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
