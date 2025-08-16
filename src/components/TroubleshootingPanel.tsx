'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function TroubleshootingPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  
  const checkApiHealth = async () => {
    setIsCheckingHealth(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setHealthStatus(data);
      toast.success('Environment check completed');
    } catch (error) {
      console.error('Error checking API health:', error);
      toast.error('Failed to check environment variables');
    } finally {
      setIsCheckingHealth(false);
    }
  };
  
  return (
    <div className="mt-8 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left"
      >
        <span className="font-medium">Troubleshooting Guide</span>
        <svg
          className={`h-5 w-5 transform ${isOpen ? 'rotate-180' : ''} transition-transform`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-4 border-t">
          <h3 className="font-medium mb-2">Common Issues and Solutions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm">API Key Errors</h4>
              <p className="text-sm text-gray-600 mt-1">
                If you see "Invalid API key" errors, make sure you've:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                <li>Added your actual Groq and OpenAI API keys to the .env.local file</li>
                <li>Replaced the placeholder text with real API keys</li>
                <li>Restarted the development server after updating the .env.local file</li>
              </ul>
              <div className="bg-gray-50 p-3 mt-2 rounded text-sm">
                <code>
                  GROQ_API_KEY=your_real_groq_api_key_here<br/>
                  OPENAI_API_KEY=your_real_openai_api_key_here
                </code>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Text Not Appearing</h4>
              <p className="text-sm text-gray-600 mt-1">
                If generated text isn't showing up:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                <li>Check browser console for JavaScript errors</li>
                <li>Try a different AI provider (toggle between Groq and OpenAI)</li>
                <li>Verify that you're using a transcript with enough content</li>
                <li>Check your network connection</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-sm">Server Errors</h4>
              <p className="text-sm text-gray-600 mt-1">
                If you see 500 server errors:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-600 mt-1">
                <li>Check server logs in your terminal</li>
                <li>Ensure all environment variables are set correctly</li>
                <li>Verify that your API keys have sufficient credits/quota</li>
                <li>Try restarting the development server</li>
              </ul>
            </div>
            
            <div>
              <button
                onClick={checkApiHealth}
                disabled={isCheckingHealth}
                className="mt-2 px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded border border-blue-200 text-sm font-medium"
              >
                {isCheckingHealth ? 'Checking...' : 'Check Environment Variables'}
              </button>
              
              {healthStatus && (
                <div className="mt-3 text-sm">
                  <h4 className="font-medium mb-1">Environment Status:</h4>
                  <div className="bg-gray-50 p-3 rounded">
                    <p>GROQ API Key: <span className={healthStatus.envVarsSet.groqApiKey ? 'text-green-600' : 'text-red-600'}>
                      {healthStatus.apiKeys.groq}
                    </span></p>
                    <p>OpenAI API Key: <span className={healthStatus.envVarsSet.openaiApiKey ? 'text-green-600' : 'text-red-600'}>
                      {healthStatus.apiKeys.openai}
                    </span></p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
