import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { saveSummary, getUserSummaries } from '@/lib/db';

export async function GET(_: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = session.user.email || 'unknown';
    const summaries = await getUserSummaries(userId);
    
    return NextResponse.json({ summaries });
  } catch (error) {
    console.error('Error retrieving summaries:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to retrieve summaries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { transcript, prompt, summary } = await request.json();
    
    if (!transcript || !summary) {
      return NextResponse.json({ error: 'Transcript and summary are required' }, { status: 400 });
    }

    const userId = session.user.email || 'unknown';
    
    const summaryId = await saveSummary({
      userId,
      transcript,
      prompt: prompt || '',
      summary,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ id: summaryId });
  } catch (error) {
    console.error('Error saving summary:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save summary' },
      { status: 500 }
    );
  }
}
