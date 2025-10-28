"use client";
import LogsSidebar from "./logs-sidebar";
import Log from "./log";
import { motion } from "framer-motion";

export default function TitlePage({ title }: { title: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex h-[calc(100vh-128px)]"
    >
      <div className="w-64 flex-shrink-0">
        <LogsSidebar />
      </div>
      <div className="flex-1">
        <Log title={title} />
      </div>
    </motion.div>
  );
}
