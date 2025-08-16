import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function GET(request: NextRequest) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const testEmail = searchParams.get('email');
    
    if (!testEmail) {
      return NextResponse.json({ error: 'Email parameter is required' }, { status: 400 });
    }
    
    // Test SendGrid
    console.log('Testing email configuration with SendGrid');
    const sendGridResult = await sendEmail({
      to: [testEmail],
      subject: 'Test Email from AI Meeting Summarizer',
      text: 'This is a test email to verify that your email configuration is working correctly.',
      html: `
        <h1>Email Configuration Test</h1>
        <p>This is a test email sent from your AI Meeting Summarizer application to verify that your email configuration is working correctly.</p>
        <p>If you received this email, it means your SendGrid configuration is working!</p>
      `,
      provider: 'sendgrid'
    });
    
    // Test Nodemailer
    console.log('Testing email configuration with Nodemailer');
    const nodemailerResult = await sendEmail({
      to: [testEmail],
      subject: 'Test Email from AI Meeting Summarizer (Nodemailer)',
      text: 'This is a test email to verify that your Nodemailer configuration is working correctly.',
      html: `
        <h1>Email Configuration Test (Nodemailer)</h1>
        <p>This is a test email sent from your AI Meeting Summarizer application to verify that your Nodemailer configuration is working correctly.</p>
        <p>If you received this email, it means your Nodemailer configuration is working!</p>
      `,
      provider: 'nodemailer'
    });
    
    return NextResponse.json({
      sendgrid: {
        success: sendGridResult.success,
        message: sendGridResult.message
      },
      nodemailer: {
        success: nodemailerResult.success,
        message: nodemailerResult.message
      },
      configPresent: {
        sendgrid: !!process.env.SENDGRID_API_KEY,
        nodemailer: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD)
      }
    });
  } catch (error) {
    console.error('Error testing email configuration:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to test email configuration' },
      { status: 500 }
    );
  }
}
