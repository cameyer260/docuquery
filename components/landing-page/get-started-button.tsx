import Link from "next/link";
import { Button } from "../ui/button";

export default function GetStartedButton() {
  return (
    <Button className="bg-[#00A1FF] p-2 text-white text-3xl font-bold rounded-lg">
      <Link href="/sign-up">Get Started</Link>
    </Button>
  );
}
