"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SocialAuthButtons from "../components/SocialAuthButtons";

interface LoginFormProps {
  callbackUrl: string;
  authError: string | null;
}

export default function LoginForm({ callbackUrl, authError }: LoginFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Map NextAuth error codes to user-friendly messages
  const getErrorMessage = useCallback((error: string) => {
    switch (error) {
      case "OAuthSignin":
        return "Error in constructing an authorization URL";
      case "OAuthCallback":
        return "Error in handling the response from an OAuth provider";
      case "OAuthCreateAccount":
        return "Could not create OAuth account in the database";
      case "EmailCreateAccount":
        return "Could not create email account in the database";
      case "Callback":
        return "Error in the OAuth callback handler route";
      case "OAuthAccountNotLinked":
        return "The email on the account is already linked, but not with this OAuth provider";
      case "EmailSignin":
        return "The email address is not configured for sign in";
      case "CredentialsSignin":
        return "The credentials you provided are incorrect";
      case "SessionRequired":
        return "You must be signed in to view this page";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  }, []);

  useEffect(() => {
    if (authError) {
      setError(getErrorMessage(authError));
    }
  }, [authError, getErrorMessage]);

  useEffect(() => {
    // If user is already signed in, redirect them
    if (status === "authenticated" && session) {
      router.push(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render login form if user is already authenticated
  if (status === "authenticated") {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Already signed in</h2>
          <p className="text-muted-foreground">Redirecting you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Social Auth */}
      <SocialAuthButtons mode="login" callbackUrl={callbackUrl} />

      {/* Register Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-green-600 hover:text-green-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
          >
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
}
