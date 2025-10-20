import Image from "next/image";
import Link from "next/link";

export default function FileBlock({
  imgUrl,
  title,
}: {
  imgUrl: string;
  title: string;
}) {
  return (
    <Link href={`/ask/${title}`}>
      <div className="flex flex-col border border-foreground/10 rounded-xl shadow-md hover:shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 ease-in-out hover:scale-105 hover:bg-foreground/5">
        <div className="p-6 border-b border-foreground/10 w-full flex items-center justify-center">
          <Image
            src={imgUrl}
            height="120"
            width="120"
            alt={`PDF preview for ${title}`}
            className="object-contain"
          />
        </div>
        <div className="text-lg font-medium text-center p-4 text-foreground/90">
          <p>{title}</p>
        </div>
      </div>
    </Link>
  );
}
