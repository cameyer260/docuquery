"use client"

import { createContext, useContext, useState, useEffect, SetStateAction } from "react"
import type { ClientDocument } from "@/types/client-side-types";

export interface Data {
  documents: ClientDocument[],
  setDocuments: React.Dispatch<SetStateAction<ClientDocument[]>>,
  error: boolean,
  setError: React.Dispatch<SetStateAction<boolean>>,
  errorText: string,
  setErrorText: React.Dispatch<SetStateAction<string>>,
  success: boolean,
  setSuccess: React.Dispatch<SetStateAction<boolean>>,
  successText: string,
  setSuccessText: React.Dispatch<SetStateAction<string>>,
  triggerRefetch: boolean,
  setTriggerRefetch: React.Dispatch<SetStateAction<boolean>>,
  loading: boolean,
  setLoading: React.Dispatch<SetStateAction<boolean>>,
};

const DataContext = createContext<Data | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("An error occurred when fetching your documents. Please try again later.");
  const [success, setSuccess] = useState<boolean>(false);
  const [successText, setSuccessText] = useState<string>("Successfully uploaded the document!");
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const data: Data = {
    documents, setDocuments,
    error, setError,
    errorText, setErrorText,
    success, setSuccess,
    successText, setSuccessText,
    triggerRefetch, setTriggerRefetch,
    loading, setLoading,
  };

  /**
    * useEffect for fetching the users' documents
    */
  useEffect(() => {
    const fetchFilesMetadata = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/files/fetch-all", {
          method: "GET"
        });
        const result = await res.json();
        if (!res.ok) throw result.error;

        // loop the result payload and set our client docs accordingly
        setDocuments(result.payload.map((item: ClientDocument) => {
          return { imgUrl: item.imgUrl, title: item.title, id: item.id };
        }));

        setError(false);
        setErrorText("An error occurred when fetching your documents. Please try again later.");
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setErrorText(error as string);
        setLoading(false);
      }
    }

    fetchFilesMetadata();
  }, [triggerRefetch]);

  return (
    <DataContext.Provider value={data}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside <DataProvider>");
  return context;
}
