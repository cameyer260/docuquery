"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SignInError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Map NextAuth error codes to user-friendly messages
  const errorMessages: { [key: string]: string } = {
    Configuration: "There was an error in the server configuration.",
    AccessDenied: "There was an error in restricted access.",
    Default: "An unexpected error occurred. Please try again later.",
  };

  const displayError =
    (error
      ? errorMessages[error] || errorMessages.Default
      : "An error occurred.") +
    " We have been notified and are working hard to fix it.";

  return (
    <div className="flex items-center justify-center h-[calc(100vh-128px)] p-4">
      <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 rounded-lg shadow-lg p-6 border border-foreground/10 flex flex-col gap-4 text-center">
        <h1 className="text-2xl font-bold text-foreground/90">Sign-Up Error</h1>
        <p className="text-sm text-foreground/70">{displayError}</p>
        <Button
          asChild
          className="bg-[#00A1FF] hover:bg-[#0088D4] px-4 py-2 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
        >
          <Link href="/auth/signin">Back to Sign In</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="px-4 py-2 text-sm font-semibold rounded-lg border border-foreground/20 bg-background/50 hover:bg-foreground/10 transition-all duration-200"
        >
          <Link href="/">Go to Home</Link>
        </Button>
      </div>
    </div>
  );
}
