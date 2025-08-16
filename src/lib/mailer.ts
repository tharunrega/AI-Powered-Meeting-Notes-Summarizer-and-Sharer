import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';

interface SendEmailOptions {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  provider?: 'sendgrid' | 'nodemailer' | 'direct';
}

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Create a nodemailer transport configuration
const getNodemailerTransport = () => {
  try {
    // For Gmail, we need an app password if 2FA is enabled
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
      // Add more debug information for troubleshooting
      logger: true,
      debug: process.env.NODE_ENV !== 'production',
    });
  } catch (error) {
    console.error('Failed to create nodemailer transport:', error);
    throw error;
  }
};

export async function sendEmail({
  to,
  subject,
  text,
  html,
  provider = 'sendgrid'
}: SendEmailOptions): Promise<{ success: boolean; message: string }> {
  try {
    // Default email from address
    const from = process.env.EMAIL_FROM || 'noreply@aimeetingsummarizer.com';
    
    console.log('Attempting to send email with provider:', provider);
    console.log('Recipients:', to);
    
    // Use SendGrid
    if (provider === 'sendgrid' && process.env.SENDGRID_API_KEY) {
      console.log('Using SendGrid to send email');
      
      try {
        await sgMail.send({
          from,
          to,
          subject,
          text,
          html: html || text,
        });
        
        return { success: true, message: 'Email sent successfully with SendGrid' };
      } catch (sgError: any) {
        console.error('SendGrid error:', sgError);
        
        // Return the specific SendGrid error for better debugging
        const errorMessage = sgError.response?.body?.errors?.[0]?.message || sgError.message;
        return { success: false, message: `SendGrid error: ${errorMessage}` };
      }
    }
    
    // Use Nodemailer
    else if (provider === 'nodemailer' && process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      console.log('Using Nodemailer to send email');
      
      try {
        // Create a new transport for each send to avoid connection issues
        const transport = getNodemailerTransport();
        
        const info = await transport.sendMail({
          from,
          to: to.join(','),
          subject,
          text,
          html: html || text,
        });
        
        return { success: true, message: `Email sent successfully with Nodemailer: ${info.messageId}` };
      } catch (nmError: any) {
        console.error('Nodemailer error:', nmError);
        
        // Return more specific nodemailer error messages
        let errorMsg = 'Nodemailer error';
        if (nmError.code === 'EAUTH') {
          errorMsg = 'Authentication failed. Please check your email/password.';
        } else if (nmError.code === 'ESOCKET' || nmError.code === 'ECONNECTION') {
          errorMsg = 'Connection to mail server failed. Please check your network or server settings.';
        } else {
          errorMsg = nmError.message;
        }
        
        return { success: false, message: errorMsg };
      }
    }
    
    // Try direct API as fallback (demonstrates a simple alternative if no email service is available)
    else if (provider === 'direct') {
      console.log('Using direct email delivery (demo mode)');
      // This is a simulated direct delivery - in a real app you'd use another email service
      return { success: true, message: 'Email simulation successful (demo mode)' };
    }
    
    // If we get here, no email service was available
    console.error('No email service is configured');
    return { 
      success: false,
      message: 'No email service is configured. Please check your environment variables: SENDGRID_API_KEY or EMAIL_USER/EMAIL_PASSWORD.' 
    };
  } catch (error: any) {
    console.error('Unexpected error sending email:', error);
    return { 
      success: false, 
      message: `Failed to send email: ${error.message || 'Unknown error'}` 
    };
  }
}
