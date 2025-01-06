import React from 'react';

const TermsAndConditions = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
      <p className="mb-4">Last Updated: January 4, 2025</p>
      
      <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing or using the XLSX Converter ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of these Terms, you do not have permission to access or use the Service.
      </p>
      
      <h2 className="text-xl font-semibold mb-2">2. Service Description</h2>
      <p className="mb-4">
        The XLSX Converter is a browser-based tool that converts Excel (XLSX) files to CSV format. The Service:
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>Processes files locally in your browser</li>
        <li>Supports multiple sheet conversion</li>
        <li>Maintains data privacy through local processing</li>
        <li>Provides immediate file download options</li>
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">3. User Obligations</h2>
      <h3 className="text-lg font-semibold mb-2">3.1 Acceptable Use</h3>
      <p className="mb-4">You agree to use the Service:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>In compliance with all applicable laws</li>
        <li>For legitimate business or personal purposes</li>
        <li>Without violating any third-party rights</li>
        <li>Without attempting to compromise the Service's security</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">3.2 Prohibited Activities</h3>
      <p className="mb-4">You must not:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>Attempt to bypass any Service limitations</li>
        <li>Use the Service for malicious purposes</li>
        <li>Distribute malware through the Service</li>
        <li>Attempt to reverse engineer the Service</li>
        <li>Use automated methods to access the Service</li>
        <li>Redistribute or sell the Service</li>
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">4. Intellectual Property</h2>
      <h3 className="text-lg font-semibold mb-2">4.1 Ownership</h3>
      <ul className="mb-4 list-disc list-inside">
        <li>The Service, including its original content and code, is owned by us</li>
        <li>The conversion results belong to you</li>
        <li>You retain all rights to your uploaded files</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">4.2 License</h3>
      <p className="mb-4">
        We grant you a limited, non-exclusive, non-transferable license to use the Service for its intended purpose.
      </p>
      
      <h2 className="text-xl font-semibold mb-2">5. Disclaimer of Warranties</h2>
      <p className="mb-4">
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, INCLUDING BUT NOT LIMITED TO:
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>Accuracy of conversion results</li>
        <li>Uninterrupted service</li>
        <li>Security of local processing</li>
        <li>Fitness for a particular purpose</li>
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
      <p className="mb-4">
        TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR:
      </p>
      <ul className="mb-4 list-disc list-inside">
        <li>Any indirect, incidental, or consequential damages</li>
        <li>Loss of data or business interruption</li>
        <li>Damages resulting from service use or inability to use</li>
        <li>Any errors in conversion results</li>
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">7. Data Privacy and Security</h2>
      <h3 className="text-lg font-semibold mb-2">7.1 Local Processing</h3>
      <ul className="mb-4 list-disc list-inside">
        <li>All file processing occurs locally in your browser</li>
        <li>We do not store or transmit your files</li>
        <li>We cannot access your file contents</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">7.2 User Responsibility</h3>
      <p className="mb-4">You are responsible for:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>The content of your files</li>
        <li>Backing up your data</li>
        <li>Verifying conversion results</li>
        <li>Maintaining your device's security</li>
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">8. Modifications</h2>
      <h3 className="text-lg font-semibold mb-2">8.1 To the Service</h3>
      <p className="mb-4">We reserve the right to:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>Modify or discontinue the Service</li>
        <li>Update features or functionality</li>
        <li>Change technical requirements</li>
        <li>Alter conversion capabilities</li>
      </ul>
      
      <h3 className="text-lg font-semibold mb-2">8.2 To the Terms</h3>
      <p className="mb-4">
        We may modify these Terms at any time. Continued use of the Service constitutes acceptance of modified Terms.
      </p>
      
      <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
      <p className="mb-4">We reserve the right to:</p>
      <ul className="mb-4 list-disc list-inside">
        <li>Terminate access to the Service</li>
        <li>Modify or discontinue the Service</li>
        <li>Block specific users or regions</li>
        <li>Remove any content or features</li>
      </ul>
      
      <h2 className="text-xl font-semibold mb-2">10. Governing Law</h2>
      <p className="mb-4">
        These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
      </p>
      
      <h2 className="text-xl font-semibold mb-2">11. Contact Information</h2>
      <p className="mb-4">
        For questions about these Terms, please contact us at [Your Contact Information].
      </p>
    </div>
  );
};

export default TermsAndConditions;