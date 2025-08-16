import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define explicit types for session and token to fix the TypeScript error
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

// Extend the Session type to include user.id
interface CustomSession extends Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string;
  }
}

interface SessionCallbackParams {
  session: CustomSession;
  token: JWT;
}

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async session({ session, token }: SessionCallbackParams) {
      if (session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
