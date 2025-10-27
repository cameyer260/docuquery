import GetStarted from "@/components/landing-page/get-started";
import GetStartedButton from "@/components/landing-page/get-started-button";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/upload");

  return (
    <div className="flex flex-col p-12 gap-12">
      <div className="flex flex-col text-center gap-4 text-5xl font-bold">
        <h1>Ask GPT Questions About Your PDFs</h1>
        <h1>Get Instant, Accurate Answers</h1>
      </div>
      <div className="flex flex-col text-center gap-4 text-2xl">
        <div className="flex flex-col gap-2">
          <h1>Hate reading your textbook? Let AI do it for you.</h1>
          <h1 className="font-bold text-3xl">How It Works</h1>
        </div>
        <div className="flex flex-col items-center gap-4">
          {/** Light blue color used for icons and buttons here on the landing page -> #00A1FF */}
          <GetStarted />
          <GetStartedButton />
        </div>
      </div>
    </div>
  );
}
