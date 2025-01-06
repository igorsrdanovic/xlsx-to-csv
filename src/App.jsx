import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import XLSXConverter from './components/XLSXConverter';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import Analytics from './utils/Analytics';

const App = () => {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route path="/" element={<XLSXConverter />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </Router>
  );
};

export default App;