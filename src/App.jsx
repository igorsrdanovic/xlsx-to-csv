import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import XLSXConverter from './components/XLSXConverter';
import TermsAndConditions from './components/TermsAndConditions';
import PrivacyPolicy from './components/PrivacyPolicy';
import Analytics from './utils/Analytics';

const App = () => {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route exact path="/" component={XLSXConverter} />
        <Route path="/terms-and-conditions" component={TermsAndConditions} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
      </Routes>
    </Router>
  );
};

export default App;