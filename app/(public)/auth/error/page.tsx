"use client";

import { AlertCircle, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorDetails = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return {
          title: "Server Configuration Error",
          description:
            "There is a problem with the server configuration. Please contact support.",
          canRetry: false,
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description:
            "You do not have permission to sign in. This might be because your account has been disabled or you're trying to access a restricted resource.",
          canRetry: false,
        };
      case "Verification":
        return {
          title: "Unable to Sign In",
          description:
            "The sign-in link was invalid or has expired. Please request a new sign-in link.",
          canRetry: true,
        };
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
        return {
          title: "OAuth Provider Error",
          description:
            "There was an error with the OAuth provider. This might be a temporary issue.",
          canRetry: true,
        };
      case "EmailCreateAccount":
        return {
          title: "Account Creation Failed",
          description:
            "We couldn't create your account. The email might already be associated with another account.",
          canRetry: true,
        };
      case "Callback":
        return {
          title: "Callback Error",
          description:
            "There was an error in the authentication callback. Please try signing in again.",
          canRetry: true,
        };
      case "OAuthAccountNotLinked":
        return {
          title: "Account Already Linked",
          description:
            "This email is already associated with another account. Please sign in with the original provider or contact support.",
          canRetry: false,
        };
      case "SessionRequired":
        return {
          title: "Authentication Required",
          description: "You need to be signed in to access this page.",
          canRetry: true,
        };
      default:
        return {
          title: "Authentication Error",
          description:
            "An unexpected error occurred during authentication. Please try again.",
          canRetry: true,
        };
    }
  };

  const { title, description, canRetry } = getErrorDetails(error);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Error Alert */}
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">{description}</AlertDescription>
        </Alert>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {canRetry && (
            <Button asChild className="w-full">
              <Link href="/auth/login">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Link>
            </Button>
          )}

          <Button variant="outline" asChild className="w-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Debug Info (only in development) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <p className="text-xs font-mono text-muted-foreground">
              Error Code: {error}
            </p>
          </div>
        )}

        {/* Support Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="mailto:support@yourdomain.com"
              className="text-primary hover:underline"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
