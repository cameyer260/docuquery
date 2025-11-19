import { motion } from "framer-motion";
import FileBlock from "../upload/file-block";
import type { ClientDocument } from "@/types/client-side-types";

export default function YourDocumentsBlock({
  documents,
}: {
  documents: ClientDocument[];
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
      key={documents.length} // must get a key that will change when the user uploads/deletes files to trigger re render, otherwise framer-motion will only render on mount
    >
      {documents.map((el) => (
        <motion.div key={el.id} variants={item}>
          <FileBlock imgUrl={el.imgUrl} title={el.title} />
        </motion.div>
      ))}
    </motion.div>
  );
}
