"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import SocialAuthButtons from "../components/SocialAuthButtons";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSocialAuth = async (provider: "google" | "github") => {
    setIsLoading(true);
    try {
      // Simulate social auth
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(`Social signup with ${provider}`);

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
        <h2 className="text-2xl font-bold tracking-tight">Create an account</h2>
        <p className="text-muted-foreground">
          Join our community and start sharing your knowledge
        </p>
      </div>

      {/* Social Auth */}
      <SocialAuthButtons
        mode="register"
        onSocialAuth={handleSocialAuth}
        isLoading={isLoading}
      />

      {/* Login Link */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-green-600 hover:text-green-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
