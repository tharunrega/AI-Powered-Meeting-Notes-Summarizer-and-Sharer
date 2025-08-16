'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import TranscriptUpload from '@/components/TranscriptUpload';
import PromptInput from '@/components/PromptInput';
import SummaryEditor from '@/components/SummaryEditor';
import EmailShare from '@/components/EmailShare';
import ExportButtons from '@/components/ExportButtons';
import ModelSelector from '@/components/ModelSelector';
import TroubleshootingPanel from '@/components/TroubleshootingPanel';
import { groqModels } from '@/lib/models';

export default function Home() {
  const { data: session } = useSession();
  
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('Summarize this meeting in bullet points, highlighting key decisions and action items.');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  
  // Model selection
  const [provider, setProvider] = useState<'groq' | 'openai'>('groq');
  const [modelId, setModelId] = useState(groqModels[0].id);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    if (!transcript.trim()) {
      toast.error('Please provide a transcript first');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          prompt,
          provider,
          model: modelId
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }
      
      setSummary(data.summary);
      toast.success('Summary generated successfully!');
      
      // Save to database if logged in
      if (session?.user) {
        try {
          await fetch('/api/summaries', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              transcript,
              prompt,
              summary: data.summary,
            }),
          });
        } catch (error) {
          console.error('Error saving summary:', error);
          // Don't show error to user as this is a background operation
        }
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      const message = error instanceof Error ? error.message : 'Failed to generate summary';
      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareComplete = (success: boolean, message: string) => {
    if (success) {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">AI Meeting Notes Summarizer</h1>
        <p className="text-gray-600">
          Upload or paste your meeting transcript, customize the prompt, and generate an AI-powered summary.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg text-black shadow p-6">
            <h2 className="text-xl font-semibold mb-4">1. Upload Transcript</h2>
            <TranscriptUpload transcript={transcript} setTranscript={setTranscript} />
          </div>

          <div className="bg-white rounded-lg text-black shadow p-6">
            <h2 className="text-xl font-semibold mb-4">2. Customize AI Instructions</h2>
            <PromptInput prompt={prompt} setPrompt={setPrompt} />
            
            <div className="mt-4">
              <ModelSelector 
                provider={provider}
                setProvider={setProvider}
                modelId={modelId}
                setModelId={setModelId}
              />
            </div>
          </div>

          <button
            onClick={handleGenerateSummary}
            disabled={isLoading || !transcript.trim()}
            className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
              isLoading || !transcript.trim()
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg text-black shadow p-6">
            <h2 className="text-xl font-semibold mb-4">3. Edit & Export Summary</h2>
            <SummaryEditor 
              summary={summary} 
              setSummary={setSummary} 
              isLoading={isLoading}
              errorMessage={errorMessage} 
            />
            
            {summary && !isLoading && !errorMessage && (
              <div className="mt-4">
                <ExportButtons 
                  summary={summary} 
                  onCopySuccess={() => toast.success('Copied to clipboard!')} 
                />
              </div>
            )}
          </div>

          {summary && !isLoading && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-black mb-4">4. Share Summary</h2>
              <EmailShare
                summary={summary}
                onShareComplete={handleShareComplete}
                isSharing={isSharing}
                setIsSharing={setIsSharing}
              />
            </div>
          )}
        </div>
      </div>
      
      {errorMessage && <TroubleshootingPanel />}
    </div>
  );
}
