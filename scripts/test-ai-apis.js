// Script to test both API integrations
require('dotenv').config({ path: '.env.local' });

async function runTests() {
  console.log('=== Testing AI API Integrations ===');
  
  // Test Groq API
  console.log('\n[GROQ API TEST]');
  await testGroqAPI();
  
  // Test OpenAI API
  console.log('\n[OPENAI API TEST]');
  await testOpenAIAPI();
  
  console.log('\nAll tests completed!');
}

// Groq API test function
async function testGroqAPI() {
  const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  
  if (!GROQ_API_KEY) {
    console.error('❌ Missing GROQ_API_KEY in environment variables');
    return;
  }
  
  try {
    console.log('🔄 Testing Groq API connection...');
    
    const response = await fetch(`${GROQ_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Give a one-sentence summary of what a meeting summarizer does.' }
        ],
        model: 'llama3-70b-8192',
        temperature: 0.7,
        max_tokens: 100,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Groq API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ Groq API response:', data.choices[0]?.message.content);
    console.log('✅ Connection successful!');
    
  } catch (error) {
    console.error('❌ Error testing Groq API:', error.message);
  }
}

// OpenAI API test function
async function testOpenAIAPI() {
  const OPENAI_API_BASE = 'https://api.openai.com/v1';
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  if (!OPENAI_API_KEY) {
    console.error('❌ Missing OPENAI_API_KEY in environment variables');
    return;
  }
  
  try {
    console.log('🔄 Testing OpenAI API connection...');
    
    const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Give a one-sentence summary of what a meeting summarizer does.' }
        ],
        model: 'gpt-3.5-turbo',
        temperature: 0.7,
        max_tokens: 100,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log('✅ OpenAI API response:', data.choices[0]?.message.content);
    console.log('✅ Connection successful!');
    
  } catch (error) {
    console.error('❌ Error testing OpenAI API:', error.message);
  }
}

// Run the tests
runTests();
