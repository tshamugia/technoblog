"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import LoginForm from "./LoginForm";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const authError = searchParams.get("error");

  return <LoginForm callbackUrl={callbackUrl} authError={authError} />;
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
