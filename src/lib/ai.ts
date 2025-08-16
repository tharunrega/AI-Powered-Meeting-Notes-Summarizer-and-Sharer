// Direct API calls for both services
interface SummarizeOptions {
  transcript: string;
  prompt: string;
  provider?: 'groq' | 'openai';
  model?: string;
}

// API endpoints
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const OPENAI_API_BASE = 'https://api.openai.com/v1';

// Helper function to check if required API keys are available
function getApiKey(provider: string): string {
  const key = provider === 'groq' 
    ? process.env.GROQ_API_KEY 
    : process.env.OPENAI_API_KEY;
    
  if (!key) {
    throw new Error(`${provider.toUpperCase()} API key not found. Please set the ${provider.toUpperCase()}_API_KEY environment variable.`);
  }
  return key;
}

export async function summarizeTranscript({ 
  transcript, 
  prompt, 
  provider = 'groq',
  model
}: SummarizeOptions): Promise<string> {
  try {
    const systemPrompt = `You are an expert meeting summarizer. Your task is to analyze the following transcript and create a summary based on the specific instructions.`;
    
    const userPrompt = `Transcript: ${transcript}\n\nInstructions: ${prompt || 'Summarize this meeting transcript concisely, highlighting key points and action items.'}`;
    
    if (provider === 'groq') {
      // Groq models: https://console.groq.com/docs/models
      const groqModel = model || 'llama3-70b-8192';
      const apiKey = getApiKey('groq');
      
      // Make direct API call to Groq
      const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: groqModel,
          temperature: 0.5,
          max_tokens: 4000,
          top_p: 1,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message.content || 'Failed to generate summary.';
    } else {
      // Fallback to OpenAI if GROQ is not configured or specified
      const openaiModel = model || 'gpt-4o';
      const apiKey = getApiKey('openai');
      
      // Make direct API call to OpenAI
      const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: openaiModel,
          temperature: 0.5,
          max_tokens: 4000,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices[0]?.message.content || 'Failed to generate summary.';
    }
  } catch (error) {
    console.error('Error summarizing transcript:', error);
    if (error instanceof Error) {
      // Handle specific error types
      if (error.message.includes('rate limit')) {
        throw new Error('API rate limit exceeded. Please try again later.');
      } else if (error.message.includes('Invalid API Key') || error.message.includes('invalid_api_key') || error.message.includes('Incorrect API key')) {
        throw new Error('Invalid API key detected. Please make sure you\'ve replaced the placeholder API keys in your .env.local file with valid API keys.');
      } else if (error.message.includes('API key not found')) {
        throw new Error('API key not found. Please check your .env.local file and make sure the API keys are properly set.');
      }
      throw error;
    }
    throw new Error('Failed to summarize transcript. Please try again later.');
  }
}
