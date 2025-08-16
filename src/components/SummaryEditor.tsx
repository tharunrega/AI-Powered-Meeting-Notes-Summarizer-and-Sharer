'use client';

import React from 'react';


interface SummaryEditorProps {
  summary: string;
  setSummary: (summary: string) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export default function SummaryEditor({ summary, setSummary, isLoading, errorMessage }: SummaryEditorProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
          AI-Generated Summary
        </label>
        <span className="text-xs text-black">Feel free to edit this summary</span>
      </div>

      {isLoading ? (
        <div className="rounded-md border border-gray-300 shadow-sm p-6 text-center bg-gray-50">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-black">Generating summary...</p>
          </div>
        </div>
      ) : errorMessage ? (
        <div className="rounded-md border border-red-200 shadow-sm p-6 bg-red-50">
          <div className="flex flex-col items-center justify-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-red-700 font-medium mb-1">Error generating summary</p>
              <p className="text-red-600 text-sm">{errorMessage}</p>
            </div>
            <div className="w-full border-t border-red-200 pt-4 mt-4">
              <p className="text-sm text-red-600">
                If you&apos;re seeing API key errors, please make sure you&apos;ve added valid API keys to your .env.local file and restarted the server.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <textarea
          id="summary"
          className="rounded-md border border-gray-300 shadow-sm p-3 w-full text-black focus:ring-blue-500 focus:border-blue-500"
          rows={12}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="Your AI-generated summary will appear here..."
        />
      )}
    </div>
  );
}
