"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Chrome,
  Github,
  AlertCircle,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [showBanner, setShowBanner] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [connectedProviders, setConnectedProviders] = useState<string[]>([]); // will just hold the id/name value of the providers they are connected to
  const { data: session, status } = useSession();
  const router = useRouter();

  const allProviders = [
    { id: "google", name: "Google", icon: Chrome },
    { id: "github", name: "GitHub", icon: Github },
  ];

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [router, status]);

  useEffect(() => {
    async function getConnectedProviders() {
      const response = await fetch("/api/account/providers");
      const result = await response.json();
      if (!response.ok) {
        setBannerText(
          `Failed to fetch your connected authentication providers. Error message: ${result.error} Please try again later.`,
        );
        setShowBanner(true);
        return;
      }
      setConnectedProviders(result.payload);
      console.log(result);
    }

    getConnectedProviders();
  }, []);

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false);
    setDeleteConfirmText("");
    setShowSuccessToast(true);
    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const result = await response.json();
    if (response.ok) {
      // Auto-hide toast after 3 seconds and redirect
      setTimeout(() => {
        setShowSuccessToast(false);
        router.push("/");
      }, 3000);
    } else {
      setBannerText("Unable to process your request. Please try again.");
      setShowBanner(true);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your account information and connected providers
          </p>
        </motion.div>

        {/* Error Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Something went wrong
                </h3>
                <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                  {bannerText}
                </p>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="fixed top-4 right-4 z-50 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4 shadow-lg flex items-center gap-3 max-w-md"
            >
              <div className="p-1 bg-green-100 dark:bg-green-950/50 rounded-full">
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800 dark:text-green-300">
                  Account Deleted
                </h3>
                <p className="text-sm text-green-700 dark:text-green-400">
                  Your account has been successfully deleted.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Account Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText("");
                }}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="bg-card border rounded-lg shadow-lg max-w-md w-full p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-red-100 dark:bg-red-950/30 rounded-full">
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        Delete Account
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone. This will permanently
                        delete your account and remove all of your data from our
                        servers.
                      </p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="text-sm font-medium block mb-2">
                      Type{" "}
                      <span className="font-bold text-red-600 dark:text-red-400">
                        DELETE
                      </span>{" "}
                      to confirm
                    </label>
                    <input
                      type="text"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Type DELETE"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowDeleteModal(false);
                        setDeleteConfirmText("");
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium border rounded-md hover:bg-accent transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deleteConfirmText !== "DELETE"}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <div className="grid gap-6">
          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Profile Information</h2>
              </div>
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                Read-only
              </span>
            </div>

            <div className="flex items-start gap-6">
              <div className="relative">
                <Image
                  src={session?.user?.image ? session.user.image : "/not-found"}
                  alt={
                    session?.user?.name
                      ? session.user.name
                      : "error finding name"
                  }
                  width="64"
                  height="64"
                  className="rounded-full border-2"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Full Name
                  </label>
                  <div className="px-4 py-2.5 bg-muted rounded-md border text-muted-foreground">
                    {session?.user?.name}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <div className="px-4 py-2.5 bg-muted rounded-md border text-muted-foreground">
                    {session?.user?.email}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                  <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p>
                    Your profile information is managed by your authentication
                    provider. To update your name, email, or profile picture,
                    please visit your provider&apos;s settings.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Connected Accounts Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-lg border p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">Connected Accounts</h2>
            </div>

            <div className="space-y-3">
              {allProviders.map((provider) => {
                const isConnected = connectedProviders.some(
                  (p: string) => p === provider.id,
                );
                const Icon = provider.icon;

                return (
                  <div
                    key={provider.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-2 rounded-lg ${isConnected ? "bg-green-100 dark:bg-green-950/30" : "bg-muted"}`}
                      >
                        <Icon
                          className={`w-5 h-5 ${isConnected ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{provider.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {isConnected ? "Connected" : "Not connected"}
                        </p>
                      </div>
                    </div>

                    {isConnected ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full font-medium">
                          Active
                        </span>
                        <a
                          href={
                            provider.id === "github"
                              ? "https://github.com/settings/profile"
                              : `https://myaccount.${provider.id}.com`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                          Manage
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ) : (
                      <button
                        className="px-4 py-2 text-sm font-medium bg-background border rounded-md hover:bg-accent transition-colors"
                        onClick={() => {
                          signIn("github");
                        }}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 text-sm text-muted-foreground bg-muted p-3 rounded-md border">
              <p>
                You can connect multiple authentication providers to access your
                account through different methods.
              </p>
            </div>
          </motion.div>

          {/* Account Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-lg border p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Account Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 bg-background border border-red-300 dark:border-red-800 rounded-md hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
              >
                Delete Account
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
