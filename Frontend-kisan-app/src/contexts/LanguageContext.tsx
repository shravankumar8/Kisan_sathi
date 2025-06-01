import React, { createContext, useContext, useState, useEffect } from 'react';

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  languages: Language[];
  t: (key: string) => string;
}

const languages: Language[] = [
  { code: "en-IN", name: "English", nativeName: "English" },
  { code: "hi-IN", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ta-IN", name: "Tamil", nativeName: "தமிழ்" },
  { code: "te-IN", name: "Telugu", nativeName: "తెలుగు" },
];

const translations: Record<string, Record<string, string>> = {
  en: {
    welcome: 'Welcome',
    namaste: 'Namaste',
    dashboard: 'Dashboard',
    askQuestion: 'Ask a Question',
    weather: 'Weather',
    marketPrices: 'Market Prices',
    schemes: 'Government Schemes',
    history: 'My Queries',
    settings: 'Settings',
    register: 'Register',
    login: 'Login',
    phoneNumber: 'Phone Number',
    name: 'Name',
    joinNow: 'Join Now',
    signIn: 'Sign In',
    sendOTP: 'Send OTP',
    enterOTP: 'Enter OTP',
    tapToSpeak: 'Tap and speak your farming question',
    typeQuestion: 'Type your question here...',
    getAnswer: 'Get Answer',
    processing: 'Processing your question...',
    today: 'Today',
    forecast: '5-day forecast',
    viewDetails: 'View Details',
    listenAgain: 'Listen Again',
    checkSoil: 'Check soil moisture levels today',
    quickTips: 'Quick Tips',
    recentQuery: 'Recent Query',
  },
  hi: {
    welcome: 'आपका स्वागत है',
    namaste: 'नमस्ते',
    dashboard: 'डैशबोर्ड',
    askQuestion: 'प्रश्न पूछें',
    weather: 'मौसम',
    marketPrices: 'बाजार भाव',
    schemes: 'सरकारी योजनाएं',
    history: 'मेरे प्रश्न',
    settings: 'सेटिंग्स',
    register: 'पंजीकरण',
    login: 'लॉगिन',
    phoneNumber: 'फोन नंबर',
    name: 'नाम',
    joinNow: 'अभी जुड़ें',
    signIn: 'साइन इन',
    sendOTP: 'OTP भेजें',
    enterOTP: 'OTP दर्ज करें',
    tapToSpeak: 'अपना खेती का सवाल बोलने के लिए टैप करें',
    typeQuestion: 'यहाँ अपना प्रश्न टाइप करें...',
    getAnswer: 'उत्तर प्राप्त करें',
    processing: 'आपका प्रश्न संसाधित हो रहा है...',
    today: 'आज',
    forecast: '5-दिन का पूर्वानुमान',
    viewDetails: 'विवरण देखें',
    listenAgain: 'फिर से सुनें',
    checkSoil: 'आज मिट्टी की नमी का स्तर जांचें',
    quickTips: 'त्वरित सुझाव',
    recentQuery: 'हाल का प्रश्न',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
    localStorage.setItem('preferred-language', language.code);
  };

  const t = (key: string): string => {
    return translations[currentLanguage.code]?.[key] || translations.en[key] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage) {
      const language = languages.find(lang => lang.code === savedLanguage);
      if (language) {
        setCurrentLanguage(language);
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, languages, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
