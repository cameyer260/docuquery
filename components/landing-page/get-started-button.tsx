import Link from "next/link";
import { Button } from "../ui/button";

export default function GetStartedButton() {
  return (
    <Button className="border border-foreground/10 rounded-xl shadow-md hover:shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-foreground hover:scale-105 hover:bg-foreground/5 text-2xl font-bold py-3 px-6">
      <Link href="/sign-up">Get Started</Link>
    </Button>
  );
}
