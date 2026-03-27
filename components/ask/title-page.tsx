"use client";
import LogsSidebar from "./logs-sidebar";
import Log from "./log";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function TitlePage({ title }: { title: string }) {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/");
  }, [router, status]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-0 flex-1"
    >
      <div className="w-64 flex-shrink-0">
        <LogsSidebar title={title} />
      </div>
      <div className="flex-1">
        <Log title={title} />
      </div>
    </motion.div>
  );
}
