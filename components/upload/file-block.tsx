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
      <div className="flex flex-col border border-foreground/30 rounded-lg items-center">
        <div className="p-4 border-b border-foreground/30 w-full flex items-center justify-center">
          <Image
            src={imgUrl}
            height="150"
            width="150"
            alt="pdf image overview"
          />
        </div>
        <div className="text-xl">
          <p>{title}</p>
        </div>
      </div>
    </Link>
  );
}
