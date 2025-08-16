# AI-Powered Meeting Notes Summarizer and Sharer

An application that helps you summarize meeting transcripts using AI and easily share them with others.

## Features

- **Transcript Upload**: Upload a `.txt` file or paste manually into a textarea.
- **Custom Prompt Input**: Specify instructions for the AI to generate the summary.
- **AI Summarization**: Generate structured summaries using Groq or OpenAI.
- **Email Sharing**: Share summaries with multiple recipients via email.
- **Authentication**: Secure login with Google via NextAuth.js.
- **Summary History**: Save and view your generated summaries.
- **Export Options**: Export your summaries as `.txt` or `.pdf`.
- **Copy to Clipboard**: Quickly copy summaries with one click.

## Tech Stack

- **Frontend**: Next.js (TypeScript), Tailwind CSS
- **Backend**: Next.js API Routes
- **AI API**: Groq API (preferred) or OpenAI
- **Email API**: Resend (preferred), SendGrid, or Nodemailer
- **Database**: MongoDB
- **Authentication**: NextAuth.js with Google Provider

## Getting Started

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

### Prerequisites

- Node.js (v18.17.0 or higher)
- npm or yarn
- MongoDB account (for storing summaries)
- Groq API key or OpenAI API key
- Resend, SendGrid, or email service account

### Installation

1. Clone the repository:
   ```bash
   git clone https://tharunrega/AI-Powered-Meeting-Notes-Summarizer-and-Sharer.git
   cd ai-meeting-summarizer
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   # AI API Keys
   GROQ_API_KEY=your_groq_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here

   # Email Service API Keys
   RESEND_API_KEY=your_resend_api_key_here
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   EMAIL_FROM=your-email@example.com

   # Database
   MONGODB_URI=your_mongodb_connection_string_here

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

This application is optimized for deployment on Vercel:

1. Push your code to a GitHub repository.

2. Create a new project on [Vercel](https://vercel.com).

3. Connect your GitHub repository to the Vercel project.

4. Add all the environment variables from your `.env.local` file to the Vercel project settings:
   - Go to your project settings
   - Navigate to the "Environment Variables" section
   - Add all the variables listed in the `.env.local` file

5. Deploy the application.

6. For proper authentication, update your Google OAuth credentials to include your Vercel deployment URL:
   - Add `https://your-app-name.vercel.app` to Authorized JavaScript origins
   - Add `https://your-app-name.vercel.app/api/auth/callback/google` to Authorized redirect URIs

## Testing AI API Connections

To verify that your AI API connections are working properly, you can run the test scripts:

```bash
# Test Groq API connection
npm run test:groq

# Test OpenAI API connection
npm run test:openai

# Test both APIs
npm run test:ai
```

## API Implementation Details

This application uses direct API calls to both Groq and OpenAI services, rather than relying on SDKs. This approach:

1. Reduces dependencies
2. Provides more control over API requests
3. Avoids compatibility issues with certain SDKs
4. Makes debugging easier with explicit request/response handling

The main API functionality is implemented in `src/lib/ai.ts`.

## Troubleshooting

### Email Issues

If you encounter issues with email sending functionality, please refer to the [Email Troubleshooting Guide](./docs/email-troubleshooting.md) for detailed instructions on:

- Setting up SendGrid or Gmail for email delivery
- Common error messages and their solutions
- Testing your email configuration
- Alternative email services

You can also run the email configuration test script:

```bash
npm run test:email your_email@example.com
```

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Groq](https://groq.com/)
- [OpenAI](https://openai.com/)
- [Resend](https://resend.com/)
