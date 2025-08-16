// Test script for Groq API integration
const testGroqAPI = async () => {
  const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
  const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
  
  if (!GROQ_API_KEY) {
    console.error('Missing GROQ_API_KEY in environment variables');
    return;
  }
  
  try {
    console.log('Testing Groq API connection...');
    
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello!' }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 50,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Groq API response:', data.choices[0]?.message.content);
    console.log('Connection successful!');
    
  } catch (error) {
    console.error('Error testing Groq API:', error);
  }
};

// Run the test
testGroqAPI();
