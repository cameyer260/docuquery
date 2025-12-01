"use client";
import YourDocumentsBlock from "@/components/ask/your-documents-block";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Sparkles } from "lucide-react";
import ErrorBanner from "@/components/global/error-banner";
import SuccessBanner from "@/components/global/success-banner";
import { useData } from "@/app/context/FileMetadataContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Ask() {
  const { documents, error, setError, errorText, setErrorText, success, setSuccess, successText, setSuccessText, triggerRefetch, setTriggerRefetch } = useData();
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [router, status]);

  const handleDelete = async (id: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await fetch("/api/files/delete", {
          method: "DELETE",
          body: JSON.stringify({
            id: id,
          })
        });
        const result = await res.json();

        if (!res.ok) throw result.error;

        setSuccessText("Successfully deleted the document!");
        setSuccess(true);
        setTriggerRefetch(!triggerRefetch);
        resolve();
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorText(error as string);
        setSuccess(false);
        reject(error);
      }
    })
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <ErrorBanner text={errorText} />
      )}
      {success && (
        <SuccessBanner text={successText} />
      )}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <MessageSquare className="w-8 h-8 text-muted-foreground" />
            <h1 className="text-4xl font-bold">Choose a Document to Chat With</h1>
          </div>
          <p className="text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            Select a document to start an AI-powered conversation
          </p>
        </motion.div>

        {/* Documents Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {documents.length === 0 ? (
            <div className="bg-card rounded-lg border p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No documents available
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Upload a document first to start chatting
              </p>
            </div>
          ) : (
            <YourDocumentsBlock documents={documents} onDeleteAction={handleDelete} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
