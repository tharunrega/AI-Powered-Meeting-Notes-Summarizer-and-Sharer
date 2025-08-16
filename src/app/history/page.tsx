'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { SummaryWithId } from '@/lib/db';
import ExportButtons from '@/components/ExportButtons';

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [summaries, setSummaries] = useState<SummaryWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSummaries();
    } else if (status === 'unauthenticated') {
      setIsLoading(false);
    }
  }, [status]);
  
  const fetchSummaries = async () => {
    try {
      const response = await fetch('/api/summaries');
      
      if (!response.ok) {
        throw new Error('Failed to fetch summaries');
      }
      
      const data = await response.json();
      setSummaries(data.summaries);
    } catch (error) {
      console.error('Error fetching summaries:', error);
      toast.error('Failed to load your summary history');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (status === 'loading' || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Sign In Required</h1>
        <p className="text-gray-600 mb-6">
          Please sign in to view your summary history.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Your Summary History</h1>
        <p className="text-gray-600">
          View and manage all your previously generated summaries.
        </p>
      </div>
      
      {summaries.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500 mb-4">You haven't created any summaries yet.</p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Create Your First Summary
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {summaries.map((summary) => (
            <div key={summary._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {summary.prompt ? summary.prompt.substring(0, 100) : 'Summary'}
                    {summary.prompt && summary.prompt.length > 100 ? '...' : ''}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(summary.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <ExportButtons
                    summary={summary.summary}
                    onCopySuccess={() => toast.success('Copied to clipboard!')}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded p-4 mt-2 max-h-60 overflow-auto">
                <pre className="whitespace-pre-wrap text-sm">{summary.summary}</pre>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
