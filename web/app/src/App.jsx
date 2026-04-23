import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

// Landing / marketing pages
import LandingPage from './pages/LandingPage';
import SupportPage from './pages/SupportPage';
import MarketingPage from './pages/MarketingPage';
import PrivacyPage from './pages/PrivacyPage';

// Payment / invite flows
import HomePage from './pages/HomePage';
import PaymentPage from './pages/PaymentPage';
import PartyJoinPage from './pages/PartyJoinPage';
import PartyReceiptPage from './pages/PartyReceiptPage';
import PartyPayPage from './pages/PartyPayPage';
import SuccessPage from './pages/SuccessPage';
import ErrorPage from './pages/ErrorPage';

import './App.css';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Landing / marketing */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/marketing" element={<MarketingPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />

        {/* Invite-code entry (previously at "/") */}
        <Route path="/enter" element={<HomePage />} />

        {/* Flow 2: Party / Guest invite */}
        <Route path="/join/:token" element={<PartyJoinPage />} />
        <Route path="/join/:token/receipt" element={<PartyReceiptPage />} />
        <Route path="/join/:token/pay" element={<PartyPayPage />} />
        <Route path="/party/:token" element={<PartyJoinPage />} />
        <Route path="/party/:token/receipt" element={<PartyReceiptPage />} />
        <Route path="/party/:token/pay" element={<PartyPayPage />} />

        {/* Flow 3: Public pay link */}
        <Route path="/pay/:token" element={<PaymentPage />} />

        {/* Shared */}
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/error" element={<ErrorPage />} />

        {/* Fallback → landing */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
