"use client";

import Link from "next/link";
import SocialAuthButtons from "../components/SocialAuthButtons";

export default function RegisterPage() {
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
      <SocialAuthButtons mode="register" />

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
