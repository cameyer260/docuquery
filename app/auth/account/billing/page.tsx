"use client"
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, Info } from "lucide-react";
import Loading from "@/app/loading";
import { useState } from "react";
import ErrorBanner from "@/components/global/error-banner";

export default function Billing() {
  const { status } = useSession();
  const router = useRouter();
  const [localError, setLocalError] = useState(false);
  const [localErrorText, setLocalErrorText] = useState(
    "We ran into an error fetching your usage data. Please try again later."
  );
  const [uploadCount, setUploadCount] = useState<number>(0);
  const [promptCount, setPromptCount] = useState<number>(0);
  const [uploaded, setUploaded] = useState<number>(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [router, status]);

  useEffect(() => {
    const fetchUsage = async () => {
      try {
        const res = await fetch("/api/account/usage", {
          method: "GET"
        });
        const result = await res.json();
        if (!res.ok) throw result.error;

        setUploadCount(result.payload.documentUploads);
        setPromptCount(result.payload.prompts);
        setUploaded(result.payload.documentsUploaded);

      } catch (error) {
        console.error(error);
        setLocalError(true);
        if (error instanceof Error) {
          setLocalErrorText(error.message);
        } else {
          setLocalErrorText(String(error));
        }
      }
    }

    fetchUsage();
  }, []);

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-background">
      {localError && <ErrorBanner text={localErrorText} />}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">Billing & Plans</h1>
          <p className="text-muted-foreground text-lg">Choose the plan that works best for you</p>
        </div>

        <Alert className="mb-8 border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-900">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100">
            <strong>Free Tier Limits:</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>2 document uploads per day</li>
              <li>15 prompts per day</li>
              <li>Maximum 5 documents uploaded at once</li>
              <li>Chat history limited to 100 messages</li>
              <li>Prompts limited to 175 characters each</li>
            </ul>
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
                  <span className="text-foreground">2 document uploads per day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">15 prompts per day</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Maximum 5 documents uploaded at once</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Chat history limited to 100 messages</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-foreground">Prompts limited to 175 characters each</span>
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
                <p className="text-2xl font-bold text-foreground">{uploadCount}/2</p>
                <p className="text-sm text-muted-foreground mt-1">Documents today</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-foreground">{promptCount}/15</p>
                <p className="text-sm text-muted-foreground mt-1">Prompts used</p>
              </div>
              <div className="text-center p-4 bg-background rounded-lg">
                <p className="text-2xl font-bold text-foreground">{uploaded}/5</p>
                <p className="text-sm text-muted-foreground mt-1">Active documents</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
