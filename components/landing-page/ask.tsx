import Image from "next/image";

export default function Ask() {
  return (
    <div className="flex flex-col text-base items-center gap-2">
      <div>
        <Image
          src="/landing-page/ask.png"
          width="64"
          height="64"
          alt="Ask Picture"
        />
      </div>
      <div>
        <h1>3. Ask</h1>
        <h1 className="text-sm">You Ask questions and get instant answers.</h1>
      </div>
    </div>
  );
}
