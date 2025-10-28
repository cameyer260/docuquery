"use client";
import Form from "next/form";
import { Input } from "@/components/ui/input";
import YourDocumentsBlock from "@/components/ask/your-documents-block";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText } from "lucide-react";

export interface Document {
  imgUrl: string;
  title: string;
}

export default function Upload() {
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
            <UploadIcon className="w-8 h-8 text-muted-foreground" />
            <h1 className="text-4xl font-bold">Upload a PDF</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Upload your documents to get started with AI-powered analysis
          </p>
        </motion.div>

        {/* Upload Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-lg border p-6 mb-12 max-w-2xl mx-auto"
        >
          <Form action="/api/upload" className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-2">
                Document Name
              </label>
              <Input
                id="name"
                type="text"
                name="pdf"
                placeholder="Enter a name for your PDF"
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="pdf" className="text-sm font-medium block mb-2">
                Select PDF File
              </label>
              <Input
                id="pdf"
                type="file"
                accept=".pdf"
                name="pdf"
                required
                className="w-full"
              />
            </div>

            <Input
              type="submit"
              value="Upload and Ingest"
              className="w-full mt-2 bg-primary hover:bg-primary/90 cursor-pointer"
            />
          </Form>
        </motion.div>

        {/* Your Documents Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-muted-foreground" />
            <h2 className="text-3xl font-bold">Your Documents</h2>
          </div>

          {documents.length === 0 ? (
            <div className="bg-card rounded-lg border p-12 text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                No documents uploaded yet
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Upload your first PDF to get started
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
