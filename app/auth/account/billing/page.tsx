"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info } from "lucide-react";

export default function Billing() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Billing & Plans</h1>
          <p className="text-muted-foreground text-lg">Choose the plan that works best for you</p>
        </div>

        <Alert className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <strong>Development Notice:</strong> Our billing system is currently in development. All requests are completely free for now, with the following rate limits: 1 document upload at a time, 1 upload per day, and 10 prompts per document per day.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-2xl">Free Plan</CardTitle>
              <CardDescription>Perfect for trying out the service</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">$0</span>
                <span className="text-muted-foreground">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">1 document upload at a time</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">1 upload per day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">10 prompts per document per day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Basic document processing</span>
                </li>
              </ul>
              <button className="w-full mt-6 px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors font-medium">
                Current Plan
              </button>
            </CardContent>
          </Card>

          <Card className="border-2 border-primary hover:shadow-xl transition-shadow relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
              Coming Soon
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Premium Plans</CardTitle>
              <CardDescription>Enhanced features and higher limits</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-foreground">TBD</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Unlimited document uploads</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Unlimited prompts</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Priority processing</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Advanced features</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">One-time lifetime access option available</span>
                </li>
              </ul>
              <button className="w-full mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium" disabled>
                Coming Soon
              </button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Current Usage</CardTitle>
            <CardDescription>Your activity for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-foreground">0/1</p>
                <p className="text-sm text-muted-foreground mt-1">Documents today</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-foreground">0/10</p>
                <p className="text-sm text-muted-foreground mt-1">Prompts used</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-foreground">0/1</p>
                <p className="text-sm text-muted-foreground mt-1">Active documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
