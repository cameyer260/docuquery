"use client"
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function FileBlock({
  imgUrl,
  title,
}: {
  imgUrl: string;
  title: string;
}) {
  const [url, setUrl] = useState<string>(imgUrl);

  const handleError = () => {
    console.log("Image failed to load");
    setUrl("/upload/document.png");
  }

  return (
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
  );
}
