"use client";

import Form from "next/form";
import { Input } from "@/components/ui/input";
import YourDocumentsBlock from "@/components/ask/your-documents-block";
import { useState, useEffect } from "react";

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
    <div className="flex flex-col p-8 [&_h1]:text-4xl [&_h1]:font-bold gap-12 items-center bg-gradient-to-b from-background/80 to-background min-h-screen">
      <div className="flex flex-col gap-6 items-center w-full max-w-md">
        <h1 className="text-foreground/90">Upload a PDF</h1>
        <div className="w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-foreground/10">
          <Form action="/api/upload" className="flex flex-col gap-4">
            <Input
              id="name"
              type="text"
              name="pdf"
              placeholder="Name your PDF"
              required
              className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition-all duration-200"
            />
            <Input
              id="pdf"
              type="file"
              accept=".pdf"
              name="pdf"
              required
              className="w-full px-4 py-2 rounded-lg border border-foreground/20 bg-background/50 min-h-fit file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-foreground/10 file:text-foreground/80 hover:file:bg-foreground/20 transition-all duration-200"
            />
            <Input
              type="submit"
              value="Upload and Ingest"
              className="w-full px-4 py-2 rounded-lg bg-foreground/90 text-white hover:bg-foreground/70 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition-all duration-200 cursor-pointer"
            />
          </Form>
        </div>
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-foreground/90">Your Documents</h1>
          <YourDocumentsBlock documents={documents} />
        </div>
      </div>
    </div>
  );
}
