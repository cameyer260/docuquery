"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, Chrome } from "lucide-react";
import ErrorBanner from "@/components/global/error-banner";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: { [key: string]: string } = {
    OAuthSignin: "Error in constructing an authorization URL",
    OAuthCallback: "Error in handling the response from an OAuth provider.",
    OAuthCreateAccount: "Could not create OAuth provider user in the database.",
    Callback: "Callback error.",
    SessionRequired:
      "The content of this page requires you to be signed in at all times.",
    OAuthAccountNotLinked:
      "Please sign in using the same provider you originally used. To use a new provider, first sign in and visit your Account page to link additional providers.",
    Default:
      "An unexpected error occurred. Please try again later. We have been notified and are working hard to fix it.",
  };

  const displayError = error
    ? errorMessages[error] ||
      "An unexpected error occurred. Please try again later."
    : null;

  return (
    <div className="flex items-center justify-center h-[calc(100vh-128px)] px-4">
      <Card className="w-full max-w-sm border-border shadow-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-semibold">Sign In</CardTitle>
          {displayError && <ErrorBanner text={displayError} />}
        </CardHeader>
        <CardContent className="flex flex-col space-y-3">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => signIn("google")}
          >
            <Chrome className="w-4 h-4" />
            Sign in with Google
          </Button>

          <Button
            variant="outline"
            className="flex items-center justify-center gap-2"
            onClick={() => signIn("github")}
          >
            <Github className="w-4 h-4" />
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
