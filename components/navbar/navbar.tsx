import Link from "next/link";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <nav className="border-b border-foreground/30 flex justify-between p-4 text-xl">
      <div>
        <Link href="/">Docquery</Link>
      </div>
      <div className="flex gap-8">
        <ModeToggle />
        <Link href="/about">About</Link>
        <Link href="/sign-in">Get Started</Link>
      </div>
    </nav>
  );
}
