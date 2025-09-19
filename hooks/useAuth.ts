"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@/types/auth";

export function useAuth() {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated" && !!session;
  const user = session?.user;

  const hasRole = (requiredRole: UserRole): boolean => {
    if (!user?.role) return false;

    const roleHierarchy: Record<UserRole, number> = {
      user: 1,
      author: 2,
      moderator: 3,
      admin: 4,
    };

    return roleHierarchy[user.role as UserRole] >= roleHierarchy[requiredRole];
  };

  const hasAnyRole = (roles: UserRole[]): boolean => {
    if (!user?.role) return false;
    return roles.includes(user.role as UserRole);
  };

  const canEdit = (resourceUserId: string): boolean => {
    if (!user) return false;

    // User can edit their own content
    if (user.id === resourceUserId) return true;

    // Moderators and admins can edit any content
    return hasAnyRole(["moderator", "admin"]);
  };

  const canModerate = (): boolean => {
    return hasAnyRole(["moderator", "admin"]);
  };

  const isAdmin = (): boolean => {
    return hasRole("admin");
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    canEdit,
    canModerate,
    isAdmin,
  };
}
