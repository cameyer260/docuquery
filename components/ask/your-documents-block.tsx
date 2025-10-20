import FileBlock from "../upload/file-block";
import type { Document } from "@/app/upload/page";

export default function YourDocumentsBlock({
  documents,
}: {
  documents: Document[];
}) {
  return (
    <div className="flex flex-col gap-6 items-center w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {documents.map((el, index) => (
          <FileBlock key={index} imgUrl={el.imgUrl} title={el.title} />
        ))}
      </div>
    </div>
  );
}
