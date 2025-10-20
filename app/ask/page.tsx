"use client";

import YourDocumentsBlock from "@/components/ask/your-documents-block";
import type { Document } from "../upload/page";
import { useState, useEffect } from "react";

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
    ]);
  }, []);

  return (
    <div className="flex flex-col items-center jusitfy-center p-6 gap-4">
      <h1 className="text-center text-4xl font-bold">Choose a Document to Chat With</h1>
      <YourDocumentsBlock documents={documents} />
    </div>
  );
}
