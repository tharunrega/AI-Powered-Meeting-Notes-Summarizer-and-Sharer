import { NextRequest, NextResponse } from 'next/server';
import EmailSimulation from '@/components/EmailSimulation';

export async function POST(request: NextRequest) {
  try {
    const { to, subject, summary } = await request.json();
    
    // Validate inputs
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json({ error: 'At least one recipient email is required' }, { status: 400 });
    }
    
    if (!summary) {
      return NextResponse.json({ error: 'Summary is required' }, { status: 400 });
    }
    
    // In a real application, this would send an email
    // For this demo, we're returning information that can be used to render an email simulation
    
    return NextResponse.json({
      success: true,
      provider: 'direct',
      message: 'Email simulation mode activated',
      simulationData: {
        to,
        subject: subject || 'Meeting Summary',
        summary
      }
    });
  } catch (error) {
    console.error('Error in email simulation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process request' },
      { status: 500 }
    );
  }
}
