import Link from "next/link";
import { FileSearch } from "lucide-react";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ModeToggle } from "./mode-toggle";
import UserAccount from "./user-account";
import { Button } from "@/components/ui/button";

export default async function Navbar() {
  const session = await getServerSession(authOptions);
  const navLinks = session
    ? [
        { href: "/main/upload", label: "Upload" },
        { href: "/main/ask", label: "Ask" },
        { href: "/about", label: "About" },
      ]
    : [{ href: "/about", label: "About" }];

  return (
    <nav className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
      />

      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link
          href="/"
          className="inline-flex w-fit items-center gap-3 text-lg font-semibold tracking-tight"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border/70 bg-background text-primary shadow-sm">
            <FileSearch className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span>DocuQuery</span>
            <span className="text-xs font-medium text-muted-foreground">
              Grounded PDF Q&amp;A
            </span>
          </div>
        </Link>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end">
          <div className="flex flex-wrap items-center gap-1 rounded-full border border-border/70 bg-muted/35 p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            {session ? (
              <UserAccount session={session} />
            ) : (
              <Button asChild className="h-10 rounded-full px-5 shadow-sm">
                <Link href="/auth/signin">Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
