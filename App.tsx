import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import Features from './components/Features';
import { ProcessSection, TestimonialsSection, CTASection } from './components/HomeSections';
import Footer from './components/Footer';
import ChatBot from './components/ChatBot';
import ShipmentDetails from './components/ShipmentDetails';
import QuoteSection from './components/QuoteSection';
import ScrollToTop from './components/ScrollToTop';
import FAQSection from './components/FAQSection';
import LoginPage from './components/Auth/LoginPage';
import SignUpPage from './components/Auth/SignUpPage';
import ForgotPasswordPage from './components/Auth/ForgotPasswordPage';
import { Shipment, User } from './types';
import { generateMockShipment } from './services/geminiService';

const App: React.FC = () => {
  const [activeShipment, setActiveShipment] = useState<Shipment | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleTrack = (id: string) => {
    const mock = generateMockShipment(id);
    setActiveShipment(mock);
    return mock;
  };

  const handleLogin = (email: string) => {
    setUser({
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'Client'
    });
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Hero onTrack={handleTrack} />
            <Features />
            <ProcessSection />
            <TestimonialsSection />
            <CTASection onGetQuote={() => setCurrentPage('quotes')} />
          </motion.div>
        );
      case 'about':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="pt-24 min-h-screen bg-bgMain"
          >
             <Dashboard />
             <FAQSection />
          </motion.div>
        );
      case 'tracking':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="pt-32 pb-20 container mx-auto px-6 bg-bgMain min-h-screen"
          >
            <div className="text-center mb-12">
              <span className="text-red-600 font-bold uppercase tracking-[0.3em] text-[10px]">Real-Time Visibility</span>
              <h1 className="text-4xl md:text-5xl font-black heading-font mt-2 uppercase tracking-tighter text-textMain">Package Tracking</h1>
            </div>
            <Hero onTrack={handleTrack} standalone={true} />
          </motion.div>
        );
      case 'quotes':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="pt-24 min-h-screen bg-bgMain"
          >
            <QuoteSection />
          </motion.div>
        );
      case 'login':
        return (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
          >
            <LoginPage onLogin={handleLogin} onNavigate={setCurrentPage} />
          </motion.div>
        );
      case 'signup':
        return (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
          >
            <SignUpPage onLogin={handleLogin} onNavigate={setCurrentPage} />
          </motion.div>
        );
      case 'forgot-password':
        return (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
          >
            <ForgotPasswordPage onNavigate={setCurrentPage} />
          </motion.div>
        );
      default:
        return <Hero onTrack={handleTrack} />;
    }
  };

  return (
    <div className="min-h-screen bg-bgMain text-textMain selection:bg-red-600/30 font-sans transition-colors duration-300">
      <Header 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        theme={theme} 
        toggleTheme={toggleTheme}
        currentUser={user}
        onLoginClick={() => setCurrentPage('login')}
        onLogoutClick={handleLogout}
      />
      
      <main>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {activeShipment && (
          <ShipmentDetails 
            shipment={activeShipment} 
            onClose={() => setActiveShipment(null)} 
          />
        )}
      </AnimatePresence>

      <Footer />
      <ChatBot />
      <ScrollToTop />
    </div>
  );
};

export default App;