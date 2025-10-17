import Link from "next/link";

export default function GetStartedButton() {
  return (
    <div className="bg-[#00A1FF] p-2 text-white text-3xl font-bold rounded-lg">
      <Link href="/sign-up">Get Started</Link>
    </div>
  );
}
