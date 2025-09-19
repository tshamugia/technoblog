import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthConfig } from "next-auth";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/db/client";
import { env } from "./env";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
          role: "user",
        };
      },
    }),

    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: profile.email.split("@")[0],
          role: "user",
        };
      },
    }),
  ],

  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        session.user.id = user.id;
        // Get additional profile data if needed
        const profile = await prisma.profile.findUnique({
          where: { id: user.id },
        });
        if (profile) {
          session.user.role = profile.role.toLowerCase();
          session.user.name = profile.displayName || profile.name;
        }
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      try {
        // Additional validation can be added here
        if (account?.provider === "github" || account?.provider === "google") {
          // Verify email exists
          if (!user.email) {
            console.error("No email provided by OAuth provider");
            return false;
          }

          // Create profile if it doesn't exist
          await prisma.profile.upsert({
            where: { id: user.id },
            update: {},
            create: {
              id: user.id,
              email: user.email,
              name: user.name,
              displayName:
                user.name || user.email?.split("@")[0] || "Anonymous",
              role: "user",
            },
          });

          return true;
        }
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("User signed in:", {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser,
      });
    },
    async signOut({ session }) {
      console.log("User signed out:", {
        userId: session?.user?.id,
      });
    },
  },

  debug: env.NODE_ENV === "development",

  // Security
  useSecureCookies: env.NODE_ENV === "production",

  cookies: {
    sessionToken: {
      name:
        env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: env.NODE_ENV === "production",
        domain: env.NODE_ENV === "production" ? ".yourdomain.com" : undefined,
      },
    },
  },
};
