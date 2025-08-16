import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Return true if token exists (user is logged in)
      return !!token;
    },
  },
});

export const config = {
  // Protect specific paths that require authentication
  matcher: ['/history', '/api/summaries/:path*'],
}
