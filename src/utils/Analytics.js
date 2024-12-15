// Analytics.js
import { useEffect } from 'react';

export const GA_TRACKING_ID = 'G-TJLF9HRG0D'; 

// Initialize GA script
export const initGA = () => {
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID);
};

// Track events
export const trackEvent = (action, category, label, value) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value
    });
  }
};

// Analytics component
const Analytics = () => {
  useEffect(() => {
    initGA();
  }, []);

  return null;
};

export default Analytics;