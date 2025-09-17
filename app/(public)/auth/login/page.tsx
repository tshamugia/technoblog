"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialAuthButtons from "../components/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      // Simulate social auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Social login with ${provider}`);

      // Mock success - redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error(`${provider} auth failed:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-muted-foreground">
          Sign in to your account to continue
        </p>
      </div>

      {/* Social Auth */}
      <SocialAuthButtons
        mode="login"
        onSocialAuth={handleSocialAuth}
        isLoading={isLoading}
      />

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
