'use client';

import { useState } from 'react';

export default function EmailTroubleshooter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    provider?: string;
    details?: {
      sendGridConfigured?: boolean;
      nodemailerConfigured?: boolean;
      fromEmailConfigured?: boolean;
    };
  } | null>(null);
  const [testEmail, setTestEmail] = useState('');

  const handleTestEmail = async () => {
    if (!testEmail) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/test-email?email=${encodeURIComponent(testEmail)}`);
      const data = await response.json();
      setTestResult(data);
    } catch (_) {
      setTestResult({ error: 'Failed to run test' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {isOpen ? 'Hide troubleshooting' : 'Having issues with email? Click here for troubleshooting'}
        </button>
      </div>

      {isOpen && (
        <div className="mt-3 border border-blue-100 rounded-md p-4 bg-blue-50">
          <h3 className="text-sm font-medium text-blue-800">Email Troubleshooting</h3>
          
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-3">Common issues with email sending:</p>
            <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
              <li>Email service API keys not configured properly</li>
              <li>Incorrect email format or invalid recipient addresses</li>
              <li>Server-side email rate limits</li>
              <li>Network connectivity issues</li>
            </ul>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-blue-800">Test Email Configuration</h4>
            <div className="flex mt-2">
              <input 
                type="email"
                placeholder="Enter your email"
                className="px-2 py-1 border border-gray-300 rounded-l-md text-sm flex-grow"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-r-md"
                onClick={handleTestEmail}
                disabled={isLoading || !testEmail}
              >
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            </div>
            
            {testResult && (
              <div className="mt-3 text-xs">
                <pre className="bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            <p className="font-medium text-gray-700">To fix email issues:</p>
            <div className="mt-2">
              <h5 className="font-medium">1. SendGrid Setup</h5>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Create a SendGrid account at <a href="https://app.sendgrid.com" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">sendgrid.com</a></li>
                <li>Create an API key with full Mail Send permissions</li>
                <li>Add to .env.local: <code className="bg-gray-100 px-1 rounded">SENDGRID_API_KEY=your_api_key</code></li>
                <li>Add to .env.local: <code className="bg-gray-100 px-1 rounded">EMAIL_FROM=your_verified_sender@example.com</code></li>
                <li>Verify your sender email in the SendGrid dashboard</li>
              </ul>
            </div>
            
            <div className="mt-3">
              <h5 className="font-medium">2. Gmail SMTP Setup (Alternative)</h5>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>Enable 2-Step Verification for your Gmail account</li>
                <li>Create an App Password at <a href="https://myaccount.google.com/apppasswords" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google App Passwords</a></li>
                <li>Add to .env.local: <code className="bg-gray-100 px-1 rounded">EMAIL_USER=your_gmail@gmail.com</code></li>
                <li>Add to .env.local: <code className="bg-gray-100 px-1 rounded">EMAIL_PASSWORD=your_16_char_app_password</code></li>
                <li>Add to .env.local: <code className="bg-gray-100 px-1 rounded">EMAIL_FROM=your_gmail@gmail.com</code></li>
              </ul>
            </div>
            
            <p className="mt-3 text-amber-600">Note: After updating .env.local, restart the development server for changes to take effect.</p>
          </div>
        </div>
      )}
    </div>
  );
}
