import Image from "next/image";

export default function NotFoundImage() {
  return (
    <Image
      src="/not-found/not-found.png"
      width="125"
      height="125"
      alt="404 Not Found Image"
    />
  );
}
