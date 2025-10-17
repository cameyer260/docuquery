import Image from "next/image";

export default function Process() {
  return (
    <div className="flex flex-col text-base items-center gap-2">
      <div>
        <Image
          src="/landing-page/process.png"
          width="64"
          height="64"
          alt="Process Picture"
        />
      </div>
      <div>
        <h1>2. Process</h1>
        <h1 className="text-sm">We process and index your document.</h1>
      </div>
    </div>
  );
}
