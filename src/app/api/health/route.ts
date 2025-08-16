import { NextRequest, NextResponse } from 'next/server';

export async function GET(_: NextRequest) {
  try {
    // Check if required environment variables are set
    const envStatus = {
      groqApiKey: !!process.env.GROQ_API_KEY,
      openaiApiKey: !!process.env.OPENAI_API_KEY,
      resendApiKey: !!process.env.RESEND_API_KEY,
      mongodbUri: !!process.env.MONGODB_URI,
      nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      googleClientId: !!process.env.GOOGLE_CLIENT_ID,
    };
    
    // Mask API key details but show if they're set
    const groqKeyStatus = process.env.GROQ_API_KEY 
      ? `Set (${process.env.GROQ_API_KEY.slice(0, 5)}...${process.env.GROQ_API_KEY.slice(-3)})` 
      : 'Not set';
      
    const openaiKeyStatus = process.env.OPENAI_API_KEY 
      ? `Set (${process.env.OPENAI_API_KEY.slice(0, 5)}...${process.env.OPENAI_API_KEY.slice(-3)})` 
      : 'Not set';
    
    return NextResponse.json({ 
      status: 'ok',
      envVarsSet: envStatus,
      apiKeys: {
        groq: groqKeyStatus,
        openai: openaiKeyStatus
      }
    });
  } catch (error) {
    console.error('Error in health check API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Health check failed' },
      { status: 500 }
    );
  }
}
