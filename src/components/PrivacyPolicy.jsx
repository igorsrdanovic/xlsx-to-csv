import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">Last Updated: January 4, 2025</p>
      <h2 className="text-xl font-semibold mb-2">Introduction</h2>
      <p className="mb-4">
        Welcome to the XLSX Converter ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your data. This Privacy Policy explains how our browser-based Excel to CSV converter handles your information.
      </p>
      <h2 className="text-xl font-semibold mb-2">Data Collection and Processing</h2>
      <h3 className="text-lg font-semibold mb-2">Local Processing</h3>
      <p className="mb-4">
        - All file conversion operations are performed entirely within your web browser<br />
        - Your Excel (XLSX) files are never uploaded to any server<br />
        - The conversion process happens locally on your device<br />
        - No data from your files is stored or transmitted to us or any third parties
      </p>
      <h3 className="text-lg font-semibold mb-2">Technical Information</h3>
      <p className="mb-4">
        We may automatically collect:<br />
        - Browser type and version<br />
        - Operating system<br />
        - Screen resolution<br />
        - Language preferences<br />
        - Basic usage statistics (number of conversions)<br />
        - Page views and user interactions<br />
        - Session duration and timing<br />
        - Geographic location (country/region level)<br />
        - Referral sources<br />
        - Device information
      </p>
      <p className="mb-4">
        This information is collected through Google Analytics and is used for improving the application's performance, user experience, and understanding how users interact with our service.
      </p>
      <h2 className="text-xl font-semibold mb-2">Data Storage</h2>
      <h3 className="text-lg font-semibold mb-2">Local Storage</h3>
      <p className="mb-4">
        - No user files are stored on our servers<br />
        - Temporary file processing occurs in your browser's memory<br />
        - All file data is automatically cleared when you close the converter tab<br />
        - We use cookies for analytics purposes only<br />
        - Analytics cookies are stored according to Google Analytics' retention policy
      </p>
      <h2 className="text-xl font-semibold mb-2">Data Security</h2>
      <h3 className="text-lg font-semibold mb-2">Browser Security</h3>
      <p className="mb-4">
        - We utilize modern browser security features<br />
        - All processing happens in an isolated browser environment<br />
        - We implement secure coding practices to prevent data leaks<br />
        - No third-party scripts can access your file data
      </p>
      <h2 className="text-xl font-semibold mb-2">User Rights</h2>
      <p className="mb-4">
        You have the right to:<br />
        - Know how your data is being processed<br />
        - Request information about data collection<br />
        - File complaints about data handling<br />
        - Opt-out of any analytics collection
      </p>
      <h2 className="text-xl font-semibold mb-2">Third-Party Services</h2>
      <h3 className="text-lg font-semibold mb-2">Google Analytics</h3>
      <p className="mb-4">
        We use Google Analytics to understand how users interact with our application. This service:<br />
        - Collects anonymous usage data<br />
        - Uses cookies to track user sessions<br />
        - Processes data in accordance with Google's Privacy Policy<br />
        - Implements IP anonymization<br />
        - Respects Do Not Track (DNT) browser settings
      </p>
      <p className="mb-4">
        You can opt-out of Google Analytics tracking by:<br />
        - Using the Google Analytics Opt-out Browser Add-on<br />
        - Enabling Do Not Track in your browser settings<br />
        - Disabling cookies for our domain
      </p>
      <h3 className="text-lg font-semibold mb-2">Other Third-Party Services</h3>
      <p className="mb-4">
        Our application:<br />
        - Does not share your file data with external parties<br />
        - Does not include advertising<br />
        - Does not integrate with other third-party services beyond analytics
      </p>
      <h2 className="text-xl font-semibold mb-2">Children's Privacy</h2>
      <p className="mb-4">
        Our service is not directed at children under 13 years of age. We do not knowingly collect or maintain information from children under 13.
      </p>
      <h2 className="text-xl font-semibold mb-2">Changes to Privacy Policy</h2>
      <p className="mb-4">
        We reserve the right to update this Privacy Policy at any time. Changes will be effective immediately upon posting to the application. Continued use of our service constitutes acceptance of any updates.
      </p>
      <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
      <p className="mb-4">
        For questions about this Privacy Policy, please contact us at [Your Contact Information].
      </p>
      <h2 className="text-xl font-semibold mb-2">Governing Law</h2>
      <p className="mb-4">
        This Privacy Policy is governed by Serbian law.
      </p>
    </div>
  );
};

export default PrivacyPolicy;