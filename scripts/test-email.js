// Test script for email configuration
require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

// Simplified version of the sendEmail function for testing
async function sendEmail({ to, subject, text, html, provider = 'sendgrid' }) {
  try {
    // Default email from address
    const from = process.env.EMAIL_FROM || 'noreply@aimeetingsummarizer.com';
    
    // Use SendGrid
    if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      try {
        await sgMail.send({
          from,
          to,
          subject,
          text,
          html: html || text,
        });
        
        return { success: true, message: 'Email sent successfully with SendGrid' };
      } catch (sgError) {
        console.error('SendGrid error:', sgError);
        return { success: false, message: `SendGrid error: ${sgError.message}` };
      }
    }
    
    // Use Nodemailer
    else if (provider === 'nodemailer' && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        // Create a transport for testing
        const transport = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT || '587'),
          secure: process.env.EMAIL_SECURE === 'true',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
          logger: true,
          debug: true
        });
        
        const info = await transport.sendMail({
          from,
          to: to.join(','),
          subject,
          text,
          html: html || text,
        });
        
        return { success: true, message: `Email sent successfully with Nodemailer: ${info.messageId}` };
      } catch (nmError) {
        console.error('Nodemailer error:', nmError);
        return { success: false, message: `Nodemailer error: ${nmError.message}` };
      }
    }
    
    return { 
      success: false,
      message: 'No email service is configured. Please check your environment variables.' 
    };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { 
      success: false, 
      message: `Failed to send email: ${error.message || 'Unknown error'}` 
    };
  }
}

async function testEmailConfiguration() {
  console.log('=== Email Configuration Test ===');
  
  // Check environment variables
  console.log('\nEnvironment variables:');
  console.log('- SendGrid API Key:', process.env.SENDGRID_API_KEY ? '✓ Configured' : '✗ Missing');
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM ? `✓ Configured (${process.env.EMAIL_FROM})` : '✗ Missing');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? `✓ Configured (${process.env.EMAIL_USER})` : '✗ Missing');
  console.log('- EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✓ Configured' : '✗ Missing');
  
  // Prompt for test email
  const testEmail = process.argv[2];
  if (!testEmail) {
    console.log('\n❌ Error: No test email provided');
    console.log('Please run the script with a test email address:');
    console.log('  npm run test:email your-email@example.com');
    return;
  }
  
  console.log(`\nSending test emails to: ${testEmail}`);
  
  // Test SendGrid
  console.log('\n1. Testing SendGrid:');
  try {
    const sendgridResult = await sendEmail({
      to: [testEmail],
      subject: 'Test Email from AI Meeting Summarizer (SendGrid)',
      text: 'This is a test email to verify that your SendGrid configuration is working correctly.',
      html: '<h1>SendGrid Test</h1><p>If you received this email, your SendGrid configuration is working!</p>',
      provider: 'sendgrid'
    });
    
    if (sendgridResult.success) {
      console.log('✅ SendGrid test successful!');
    } else {
      console.log(`❌ SendGrid test failed: ${sendgridResult.message}`);
    }
  } catch (error) {
    console.log(`❌ SendGrid test error: ${error.message}`);
  }
  
  // Test Nodemailer
  console.log('\n2. Testing Nodemailer:');
  try {
    const nodemailerResult = await sendEmail({
      to: [testEmail],
      subject: 'Test Email from AI Meeting Summarizer (Nodemailer)',
      text: 'This is a test email to verify that your Nodemailer configuration is working correctly.',
      html: '<h1>Nodemailer Test</h1><p>If you received this email, your Nodemailer configuration is working!</p>',
      provider: 'nodemailer'
    });
    
    if (nodemailerResult.success) {
      console.log('✅ Nodemailer test successful!');
    } else {
      console.log(`❌ Nodemailer test failed: ${nodemailerResult.message}`);
    }
  } catch (error) {
    console.log(`❌ Nodemailer test error: ${error.message}`);
  }
  
  console.log('\nTest completed. Check your email inbox for test messages.');
}

testEmailConfiguration();
