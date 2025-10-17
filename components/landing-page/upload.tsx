import Image from "next/image";

export default function Upload() {
  return (
    <div className="flex flex-col text-base items-center gap-2">
      <div>
        <Image
          src="/landing-page/upload.png"
          width="64"
          height="64"
          alt="Upload Picture"
        />
      </div>
      <div>
        <h1>1. Upload</h1>
        <h1 className="text-sm">You Upload a PDF document</h1>
      </div>
    </div>
  );
}
