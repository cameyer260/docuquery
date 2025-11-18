"use client";
import { Input } from "@/components/ui/input";
import YourDocumentsBlock from "@/components/ask/your-documents-block";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Upload as UploadIcon, FileText } from "lucide-react";
import ErrorBanner from "@/components/global/error-banner";
import type { ClientDocument } from "@/types/client-side-types";

export default function Upload() {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("An error occurred when fetching your documents. Please try again later.");

  const uploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", fileName);

    const res = await fetch("/api/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log(data);
  }

  /**
   * useEffect for fetching the users' documents
   */
  useEffect(() => {
    const fetchFilesMetadata = async () => {
      try {
        const res = await fetch("/api/files/fetch-all", {
          method: "GET"
        });
        const result = await res.json();
        if (!res.ok) throw result.error;

        // loop the result payload and set our client docs accordingly
        setDocuments(result.payload.map((item: ClientDocument) => {
          return { imgUrl: "/upload/document.png", title: item.title };
        }));

        setError(false);
        setErrorText("An error occurred when fetching your documents. Please try again later.");
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorText(error as string);
      }
    }

    fetchFilesMetadata();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      {error && (
        <ErrorBanner text={errorText} />
      )}
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
          <form onSubmit={uploadFile} className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-2">
                Document Name
              </label>
              <Input
                id="name"
                type="text"
                name="pdf"
                placeholder="Enter a name for your PDF"
                onChange={(e) => setFileName(e.target.value)}
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
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full"
              />
            </div>

            <Input
              type="submit"
              value="Upload and Ingest"
              className="w-full mt-2 bg-primary hover:bg-primary/90 cursor-pointer"
            />
          </form>
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
