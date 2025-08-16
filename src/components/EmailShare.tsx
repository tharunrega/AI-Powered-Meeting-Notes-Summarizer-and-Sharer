'use client';

import React, { useState } from 'react';
import EmailTroubleshooter from './EmailTroubleshooter';
import EmailExport from './EmailExport';

interface EmailShareProps {
  summary: string;
  onShareComplete: (success: boolean, message: string) => void;
  isSharing: boolean;
  setIsSharing: (isSharing: boolean) => void;
}

export default function EmailShare({ summary, onShareComplete, isSharing, setIsSharing }: EmailShareProps) {
  const [recipients, setRecipients] = useState('');
  const [subject, setSubject] = useState('Meeting Summary');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!recipients.trim()) {
      onShareComplete(false, 'Please enter at least one email address');
      return;
    }
    
    if (!summary.trim()) {
      onShareComplete(false, 'No summary to share');
      return;
    }
    
    // Validate email format
    const emailList = recipients.split(/[\s,]+/).filter(Boolean);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = emailList.filter(email => !emailRegex.test(email));
    
    if (invalidEmails.length > 0) {
      onShareComplete(false, `Invalid email format: ${invalidEmails.join(', ')}`);
      return;
    }
    
    setIsSharing(true);
    
    try {
      console.log('Sending summary to:', emailList);
      
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: emailList,
          subject,
          summary,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.provider === 'simulation') {
          // Handle simulation mode
          onShareComplete(true, 'Email service unavailable - switched to simulation mode');
          
          // Open simulation in a new tab
          const simulationWindow = window.open('', '_blank');
          if (simulationWindow) {
            simulationWindow.document.write(`
              <!DOCTYPE html>
              <html>
              <head>
                <title>Email Simulation</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                  .container { max-width: 800px; margin: 0 auto; background: #f9f9f9; border-radius: 5px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                  .badge { background-color: #fff3cd; color: #856404; padding: 5px 10px; border-radius: 20px; font-size: 12px; font-weight: bold; }
                  .field { margin-bottom: 15px; }
                  .label { font-size: 12px; color: #666; font-weight: bold; margin-bottom: 5px; }
                  .content { background: white; border: 1px solid #ddd; border-radius: 3px; padding: 15px; white-space: pre-line; }
                  .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
                  .btn { background: #4a86e8; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; }
                  .btn:hover { background: #3b78e7; }
                  .note { background: #e7f3ff; border-left: 4px solid #2196f3; padding: 10px; margin-top: 20px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h2>Email Simulation</h2>
                    <span class="badge">Demo Mode</span>
                  </div>
                  
                  <div class="field">
                    <div class="label">TO:</div>
                    <div>${data.simulationData.to.join(', ')}</div>
                  </div>
                  
                  <div class="field">
                    <div class="label">SUBJECT:</div>
                    <div>${data.simulationData.subject}</div>
                  </div>
                  
                  <hr>
                  
                  <div class="field">
                    <div class="label">MESSAGE:</div>
                    <div class="content">${data.simulationData.summary}</div>
                  </div>
                  
                  <div style="margin-top: 20px; display: flex; justify-content: space-between;">
                    <button class="btn" onclick="copyToClipboard()">Copy Content</button>
                    <a class="btn" href="mailto:${data.simulationData.to.join(',')}?subject=${encodeURIComponent(data.simulationData.subject)}&body=${encodeURIComponent(data.simulationData.summary)}" style="text-decoration: none;">Open in Email Client</a>
                  </div>
                  
                  <div class="note">
                    <strong>Note:</strong> This is a simulated email preview. To enable actual email sending, please configure
                    your email service credentials in the .env.local file.
                  </div>
                  
                  <div class="footer">
                    AI Meeting Notes Summarizer
                  </div>
                </div>
                
                <script>
                  function copyToClipboard() {
                    const text = ${JSON.stringify(data.simulationData.summary)};
                    navigator.clipboard.writeText(text).then(() => {
                      alert('Summary copied to clipboard!');
                    }).catch(err => {
                      console.error('Could not copy text: ', err);
                    });
                  }
                </script>
              </body>
              </html>
            `);
            simulationWindow.document.close();
          }
        } else {
          onShareComplete(true, data.message || 'Summary shared successfully');
        }
      } else {
        // Handle detailed error response
        if (data.emailServiceStatus) {
          let errorMsg = data.error || 'Email configuration issue detected';
          
          // Provide more specific guidance based on configuration status
          if (!data.emailServiceStatus.sendGridConfigured && !data.emailServiceStatus.nodemailerConfigured) {
            errorMsg = 'No email service is configured. Please check the troubleshooting section below.';
          } else if (!data.emailServiceStatus.fromEmailConfigured) {
            errorMsg = 'Sender email address (EMAIL_FROM) is not configured. Please update your .env.local file.';
          }
          
          throw new Error(errorMsg);
        } else {
          throw new Error(data.error || 'Failed to share summary');
        }
      }
    } catch (error) {
      console.error('Error sharing summary:', error);
      
      // Provide more helpful error messages
      let errorMessage = 'Failed to share summary';
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          errorMessage = 'Email service API key is invalid or missing. Please check your configuration.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Email sending rate limit exceeded. Please try again later.';
        } else if (error.message.includes('authentication') || error.message.includes('EAUTH')) {
          errorMessage = 'Email authentication failed. Please check your email service credentials.';
        } else if (error.message.includes('ECONNRESET') || error.message.includes('ESOCKET')) {
          errorMessage = 'Connection to email server failed. This could be due to network issues or incorrect server settings.';
        } else {
          errorMessage = error.message;
        }
      }
      
      onShareComplete(false, errorMessage);
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">
          Recipient Email Addresses
        </label>
        <input
          type="text"
          id="recipients"
          className="mt-1 block w-full text-black rounded-md p-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="email@gmail.com"
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
          disabled={isSharing}
        />
        <p className="mt-1 text-xs text-gray-500">Separate multiple emails with commas</p>
      </div>
      
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Email Subject
        </label>
        <input
          type="text"
          id="subject"
          className="mt-1 block w-full p-2 text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isSharing}
        />
      </div>
      
      <button
        type="submit"
        disabled={isSharing || !recipients.trim() || !summary.trim()}
        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
          isSharing || !recipients.trim() || !summary.trim()
            ? 'bg-blue-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {isSharing ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending...
          </>
        ) : (
          'Share Summary via Email'
        )}
      </button>

      {/* Divider between email sending and export options */}
      <div className="relative mt-6 mb-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {/* Email Export Component */}
      <div className="mt-3">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Export Options</h3>
        <EmailExport 
          recipients={recipients} 
          subject={subject} 
          summary={summary}
        />
      </div>
      
      <EmailTroubleshooter />
    </form>
  );
}
