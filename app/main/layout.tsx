import { DataProvider } from "../context/FileMetadataContext";

export default function DataLayout({ children }: { children: React.ReactNode }) {
  return (
    <DataProvider>
      {children}
    </DataProvider>
  );
}
