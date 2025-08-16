import { NextRequest, NextResponse } from 'next/server';
import { summarizeTranscript } from '@/lib/ai';

export async function POST(request: NextRequest) {
  try {
    const { transcript, prompt, provider, model } = await request.json();
    
    if (!transcript) {
      return NextResponse.json({ error: 'Transcript is required' }, { status: 400 });
    }
    
    // Log API request for debugging
    console.log(`Summarize API called with provider: ${provider || 'groq'}, model: ${model || 'default'}`);
    
    const summary = await summarizeTranscript({ 
      transcript, 
      prompt: prompt || 'Summarize this meeting', 
      provider: provider || 'groq',
      model
    });
    
    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error in summarize API:', error);
    let errorMessage = 'Failed to summarize transcript';
    
    if (error instanceof Error) {
      errorMessage = error.message;
      
      // Add more context to API key errors
      if (errorMessage.includes('Invalid API Key') || errorMessage.includes('Incorrect API key')) {
        errorMessage += '. Please check your .env.local file and ensure you\'ve added valid API keys.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
