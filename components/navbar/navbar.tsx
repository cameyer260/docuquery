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
        <Link href="/upload">Upload</Link>
        <Link href="/ask">Ask</Link>
        <Link href="/about">About</Link>
        <Link href="/auth/signin">Get Started</Link>
      </div>
    </nav>
  );
}
