"use client";
import YourDocumentsBlock from "@/components/ask/your-documents-block";
import type { Document } from "../upload/page";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, FileText, Sparkles } from "lucide-react";

export default function Ask() {
  const [documents, setDocuments] = useState<Document[]>([]);

  /**
   * useEffect for fetching the users' documents
   */
  useEffect(() => {
    // set documents here
    setDocuments([
      { imgUrl: "/upload/document.png", title: "file1" },
      { imgUrl: "/upload/document.png", title: "file2" },
      { imgUrl: "/upload/document.png", title: "file3" },
      { imgUrl: "/upload/document.png", title: "file4" },
      { imgUrl: "/upload/document.png", title: "file5" },
      { imgUrl: "/upload/document.png", title: "file6" },
      { imgUrl: "/upload/document.png", title: "file7" },
      { imgUrl: "/upload/document.png", title: "file8" },
      { imgUrl: "/upload/document.png", title: "file9" },
      { imgUrl: "/upload/document.png", title: "file10" },
      { imgUrl: "/upload/document.png", title: "file11" },
    ]);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
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
            <YourDocumentsBlock documents={documents} />
          )}
        </motion.div>
      </div>
    </div>
  );
}
