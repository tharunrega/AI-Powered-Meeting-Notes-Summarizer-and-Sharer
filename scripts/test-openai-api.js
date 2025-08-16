// Test script for OpenAI API integration
const testOpenAIAPI = async () => {
  const OPENAI_API_BASE = 'https://api.openai.com/v1';
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
  
  if (!OPENAI_API_KEY) {
    console.error('Missing OPENAI_API_KEY in environment variables');
    return;
  }
  
  try {
    console.log('Testing OpenAI API connection...');
    
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello!' }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 50,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('OpenAI API response:', data.choices[0]?.message.content);
    console.log('Connection successful!');
    
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
  }
};

// Run the test
testOpenAIAPI();
