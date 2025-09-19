import { getServerSession } from "next-auth/next";
import { authOptions } from "@/config/auth";
import prisma from "@/db/client";
import { UserProfile, UserRole } from "@/types/auth";

/**
 * Get the current server session
 */
export async function getSession() {
  return await getServerSession(authOptions);
}

/**
 * Get the current user profile with role information
 */
export async function getCurrentUser(): Promise<UserProfile | null> {
  try {
    const session = await getSession();
    if (!session?.user?.id) return null;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });

    if (!user || !user.profile) return null;

    return {
      id: user.id,
      email: user.email,
      name: user.name || undefined,
      username: user.username || undefined,
      image: user.image || undefined,
      role: user.profile.role.toLowerCase() as UserRole,
      bio: user.profile.bio || undefined,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

/**
 * Check if the current user has a specific role
 */
export async function hasRole(requiredRole: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const roleHierarchy: Record<UserRole, number> = {
    user: 1,
    author: 2,
    moderator: 3,
    admin: 4,
  };

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
}

/**
 * Check if the current user has any of the specified roles
 */
export async function hasAnyRole(roles: UserRole[]): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  return roles.includes(user.role);
}

/**
 * Require authentication - throws error if not authenticated
 */
export async function requireAuth(): Promise<UserProfile> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

/**
 * Require specific role - throws error if user doesn't have required role
 */
export async function requireRole(
  requiredRole: UserRole
): Promise<UserProfile> {
  const user = await requireAuth();

  if (!(await hasRole(requiredRole))) {
    throw new Error(`Insufficient permissions. Required role: ${requiredRole}`);
  }

  return user;
}

/**
 * Check if user can edit a resource (either owns it or has moderator+ role)
 */
export async function canEdit(resourceUserId: string): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  // User can edit their own content
  if (user.id === resourceUserId) return true;

  // Moderators and admins can edit any content
  return await hasAnyRole(["moderator", "admin"]);
}

/**
 * Check if user can moderate content
 */
export async function canModerate(): Promise<boolean> {
  return await hasAnyRole(["moderator", "admin"]);
}

/**
 * Check if user can access admin features
 */
export async function isAdmin(): Promise<boolean> {
  return await hasRole("admin");
}
