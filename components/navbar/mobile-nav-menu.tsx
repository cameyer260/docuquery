"use client";

import Link from "next/link";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { CircleUserRound, LogOut, Menu, Upload, MessageSquare, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MobileNavMenu({
  session,
}: {
  session: Session | null;
}) {
  const navLinks = session
    ? [
        { href: "/main/upload", label: "Upload", icon: Upload },
        { href: "/main/ask", label: "Ask", icon: MessageSquare },
        { href: "/about", label: "About", icon: Info },
      ]
    : [{ href: "/about", label: "About", icon: Info }];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full border-border/70 bg-background/80 shadow-sm"
        >
          <Menu className="h-4 w-4" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-64 rounded-2xl border-border/70 p-2 shadow-lg"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-foreground">
              {session?.user?.name || "DocuQuery"}
            </span>
            <span className="text-xs font-normal text-muted-foreground">
              {session ? "Grounded document workspace" : "Grounded PDF Q&A"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {navLinks.map(({ href, label, icon: Icon }) => (
          <DropdownMenuItem key={href} asChild className="rounded-xl px-3 py-2">
            <Link href={href}>
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        {session ? (
          <>
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
              <Link href="/auth/account">
                <CircleUserRound className="h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2">
              <Link href="/auth/account/billing">
                <CircleUserRound className="h-4 w-4" />
                Billing
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl px-3 py-2"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem asChild className="rounded-xl px-3 py-2 font-medium">
            <Link href="/auth/signin">
              <CircleUserRound className="h-4 w-4" />
              Get Started
            </Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
