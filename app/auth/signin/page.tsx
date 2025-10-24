import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignIn from "./client";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");
  else return <SignIn />;
}
