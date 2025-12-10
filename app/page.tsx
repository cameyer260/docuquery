export const dynamic = "force-dynamic";

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LandingContent from "@/components/landing-page/landing-content";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/main/upload");

  return <LandingContent />;
}
