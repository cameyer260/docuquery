"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import ErrorBanner from "@/components/global/error-banner";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  // Map NextAuth error codes to user-friendly messages
  const errorMessages: { [key: string]: string } = {
    OAuthSignin: "Error in constructing an authorization URL",
    OAuthCallback: "Error in handling the response from an OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    Callback: "Callback error.",
    SessionRequired:
      "The content of this page requires you to be signed in at all times.",
    Default:
      "An unexpected error occurred. Please try again later. We have been notified and are working hard to fix it.",
  };

  const displayError = error
    ? errorMessages[error] +
      " We have been notified and are working hard to fix it."
    : null;

  return (
    <div className="flex flex-col items-center pt-25 px-4 h-[calc(100vh-128px)]">
      {displayError && <ErrorBanner text={displayError} />}
      <h1 className="text-4xl font-bold mb-6">Sign In</h1>
      <button
        className="flex items-center space-x-2 px-6 py-3 bg-foreground border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        onClick={() => signIn("google")}
      >
        <svg
          className="w-6 h-6"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
        <span className="text-background font-medium text-sm">
          Sign in with Google
        </span>
      </button>
    </div>
  );
}
