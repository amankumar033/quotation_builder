import NextAuth, { User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

// Set the NEXTAUTH_URL if not already set in environment
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || (process.env.NODE_ENV === 'production' 
  ? 'https://crm.narayanavacation.com' 
  : 'http://localhost:3000');

export const handler = NextAuth({
  // Add base URL configuration
  basePath: "/api/auth",
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        // Return all required fields according to your extended User type
        return {
          id: user.id,
          name: user.name ?? undefined,
          email: user.email,
          role: user.role, // ✅ include role
        };
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  // Add trusted host configuration for production
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        domain: process.env.NODE_ENV === 'production' ? '.narayanavacation.com' : undefined,
      },
    },
  },
  // Add trusted hosts configuration
  trustHost: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow credentials provider as-is (already validated)
      if (account?.provider === 'credentials') return true;
      if (account?.provider === 'google') {
        const email = (user?.email || (profile as any)?.email || '').toLowerCase();
        if (!email) return false;
        const existing = await prisma.user.findUnique({ where: { email } });
        return !!existing; // Only allow if email exists in DB
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role; // may be undefined for Google until enriched
      }
      // Enrich token for Google sessions where user fields are not set
      if (!token.id && token.email) {
        const existing = await prisma.user.findUnique({ where: { email: String(token.email).toLowerCase() } });
        if (existing) {
          token.id = existing.id;
          (token as any).role = existing.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id;
      if (token?.role) session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
