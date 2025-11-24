import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserAccount from "./user-account";

export default async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <nav className="border-b border-foreground/30 flex justify-between p-4 text-xl">
      <div>
        <Link href="/">Docquery</Link>
      </div>
      <div className="flex gap-8">
        <ModeToggle />
        <Link href="/main/upload">Upload</Link>
        <Link href="/main/ask">Ask</Link>
        <Link href="/about">About</Link>
        {session ? (
          <UserAccount session={session} />
        ) : (
          <Link href="/auth/signin">Get Started</Link>
        )}
      </div>
    </nav>
  );
}
