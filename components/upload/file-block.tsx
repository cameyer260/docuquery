"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function FileBlock({
  imgUrl,
  title,
  id,
  onDeleteAction,
}: {
  imgUrl: string;
  title: string;
  id: string;
  onDeleteAction: (id: string) => Promise<void>;
}) {
  const [url, setUrl] = useState<string>(imgUrl);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleError = () => {
    console.log("Image failed to load");
    setUrl("/upload/document.png");
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (isDeleting) return;

    setIsDeleting(true);
    try {
      await onDeleteAction(id);
    } catch (error) {
      console.error("Failed to delete:", error);
      setIsDeleting(false);
    }
  }

  return (
    <div className="relative group">
      <Link href={`/ask/${title}`}>
        <div className="flex flex-col border border-foreground/10 rounded-xl shadow-md hover:shadow-lg bg-white dark:bg-gray-800 transition-all duration-300 ease-in-out hover:scale-105">
          <div className="p-6 border-b border-foreground/10 w-full flex items-center justify-center">
            <div className="w-[120px] h-[120px] relative bg-white">
              <Image
                src={url}
                fill
                alt={`PDF preview for ${title}`}
                className="object-contain"
                onError={handleError}
                unoptimized
              />
            </div>
          </div>
          <div className="text-lg font-medium text-center p-4 text-foreground/90">
            <p>{title}</p>
          </div>
        </div>
      </Link>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
        aria-label="Delete document"
      >
        {isDeleting ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Trash2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
