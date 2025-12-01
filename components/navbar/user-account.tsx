"use client";

import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function UserAccount({
  session,
}: {
  session: Session | undefined;
}) {
  return session ? (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <Image
              src={session?.user ? String(session?.user?.image) : ""}
              width="25"
              height="25"
              alt=""
              className="border-transparent rounded-full"
            />
            <h1>{session?.user?.name}</h1>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <Link href="/auth/account">
              <DropdownMenuItem>Profile</DropdownMenuItem>
            </Link>
            <Link href="/auth/account/billing">
              <DropdownMenuItem>Billing</DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full">
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div >
  ) : (
    <div>Loading...</div>
  );
}
