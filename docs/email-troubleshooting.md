# Email Troubleshooting Guide

This document provides guidance for troubleshooting email sending issues in the AI Meeting Notes Summarizer application.

## Common Error Messages

### Connection Issues

**Error**: `read ECONNRESET` or `ESOCKET`

This usually indicates a problem connecting to the email server, which could be due to:
1. Network connectivity issues
2. Incorrect server settings
3. Firewall blocking the connection
4. Server rejecting the connection

### Authentication Issues

**Error**: `Invalid API key`, `authentication failed`, or `EAUTH`

This indicates a problem with your email service credentials:
1. For SendGrid: The API key may be invalid or expired
2. For Gmail/Nodemailer: The username/password combination may be incorrect

## Setup Instructions

### SendGrid (Recommended)

1. **Create a SendGrid Account**:
   - Go to [SendGrid.com](https://sendgrid.com/) and sign up
   - Verify your account

2. **Create an API Key**:
   - Navigate to Settings > API Keys
   - Create a new API key with "Mail Send" permissions
   - Copy the key immediately (it won't be shown again)

3. **Verify Your Sender**:
   - Go to Settings > Sender Authentication
   - Verify the email address you want to send from

4. **Update Your Environment Variables**:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key
   EMAIL_FROM=your_verified_email@example.com
   ```

### Gmail with App Password (Alternative)

1. **Enable 2-Step Verification**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification if not already enabled

2. **Create an App Password**:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select App: "Mail" and Device: "Windows Computer" (or appropriate option)
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

3. **Update Your Environment Variables**:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   EMAIL_FROM=your_gmail@gmail.com
   ```

## Testing Email Configuration

You can test your email configuration using the provided test script:

```bash
npm run test:email your_test_email@example.com
```

This script will:
1. Check if your environment variables are properly set
2. Attempt to send test emails using both SendGrid and Nodemailer
3. Report success or failure for each method

## Common Issues and Solutions

### SendGrid Issues

1. **API Key Issues**:
   - Make sure the API key is correct and has not expired
   - Verify the API key has "Mail Send" permissions
   - Check for any whitespace in your API key

2. **Sender Verification**:
   - Ensure your sender email is verified in SendGrid
   - Check if you've completed domain authentication if using a custom domain

### Gmail/Nodemailer Issues

1. **ECONNRESET or Connection Errors**:
   - Ensure you're using an app password, not your regular Gmail password
   - Check if your network allows SMTP connections (some corporate networks block these)
   - Try using port 465 with `EMAIL_SECURE=true` as an alternative

2. **Authentication Failed**:
   - Double-check your Gmail username and app password
   - Ensure 2-Step Verification is enabled on your Google account
   - Make sure you've generated an app password specifically for this application

## Alternative Email Services

If both SendGrid and Gmail are not working for you, consider these alternatives:

1. **Resend.com**: A developer-friendly email API
2. **Mailgun**: Provides a simple API for sending emails
3. **Amazon SES**: AWS's email service with generous free tier

## When All Else Fails

If you're unable to configure email sending, the application will fall back to a "direct" mode that simulates email sending. This is only for demonstration purposes and does not actually send emails.
