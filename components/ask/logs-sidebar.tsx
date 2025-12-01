"use client";
import Loading from "@/app/loading";
import ErrorBanner from "../global/error-banner";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, MessageSquare } from "lucide-react";
import { useData } from "@/app/context/FileMetadataContext";

export default function LogsSidebar({ title }: { title: string }) {
  const { documents, error, loading } = useData();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 },
  };

  if (loading) return <Loading />;
  else
    return (
      <div className="flex flex-col border-r h-full overflow-hidden bg-card/50">
        {/* Header */}
        <div className="border-b p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
            <MessageSquare className="w-4 h-4" />
            <span>Your Chats</span>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner text="Sorry, but we could not fetch your other logs. Please try again later." />
        )}

        {/* Chat List */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex-1 overflow-y-auto"
        >
          {documents.map((el, i) => (
            <motion.div key={i} variants={item}>
              <Link
                className={`border-b py-3 px-4 flex items-center gap-3 hover:bg-accent transition-colors group ${title && el.title === decodeURIComponent(title) ? "bg-accent" : ""
                  }`}
                href={`/main/ask/${el.title}`}
              >
                <FileText className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                <span className="truncate text-sm">{el.title}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div >
    );
}
