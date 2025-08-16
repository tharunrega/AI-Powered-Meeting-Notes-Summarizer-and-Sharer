'use client';

import { useState } from 'react';

export default function EmailSimulation({ to, subject, summary }: { to: string[], subject: string, summary: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };
  
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Email Simulation</h1>
          <div className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
            Demo Mode
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <h2 className="text-sm font-medium text-gray-500">TO:</h2>
            <p className="text-gray-800">{to.join(', ')}</p>
          </div>
          
          <div>
            <h2 className="text-sm font-medium text-gray-500">SUBJECT:</h2>
            <p className="text-gray-800">{subject}</p>
          </div>
          
          <hr className="my-4" />
          
          <div className="prose max-w-none">
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
              {summary.split('\n').map((line, i) => (
                <p key={i} className="my-2">{line}</p>
              ))}
            </div>
          </div>
          
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
            <button
              onClick={handleCopy}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {copied ? 'Copied!' : 'Copy Summary to Clipboard'}
            </button>
            
            <a
              href={`mailto:${to.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(summary)}`}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Open in Default Email Client
            </a>
          </div>
          
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Email Service Notice</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    This is a simulated email preview. To enable actual email sending, please configure
                    your email service credentials in the <code className="bg-blue-100 px-1 rounded">.env.local</code> file.
                    See the <a href="/docs/email-troubleshooting" className="underline">Email Troubleshooting Guide</a> for setup instructions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
