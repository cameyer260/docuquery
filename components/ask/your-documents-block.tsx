import { motion } from "framer-motion";
import FileBlock from "../upload/file-block";
import type { Document } from "@/app/upload/page";

export default function YourDocumentsBlock({
  documents,
}: {
  documents: Document[];
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full"
    >
      {documents.map((el, index) => (
        <motion.div key={index} variants={item}>
          <FileBlock imgUrl={el.imgUrl} title={el.title} />
        </motion.div>
      ))}
    </motion.div>
  );
}
