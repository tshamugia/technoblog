import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    id: string;
    username?: string;
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username?: string;
      role?: string;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    username?: string;
    role?: string;
    accessToken?: string;
  }
}

// Application user roles
export type UserRole = "user" | "author" | "moderator" | "admin";

// Extended user profile for application use
export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  username?: string;
  image?: string;
  role: UserRole;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}
