import { useState, useEffect } from "react";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Button } from "../ui/button";
import { ArrowUpIcon } from "lucide-react";
import { AutoResizeTextarea } from "./auto-resize-textarea";

interface Data {
  logs: string[];
}

export default function Log({ title }: { title: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [found, setFound] = useState<boolean>(false);
  const [data, setData] = useState<Data | null>({
    logs: [
      "What is the answer to question 3?",
      "The answer to question 3 is apples (citation...)",
      "What is the answer to question 4?",
      "The answer to question 4 was not found in the text.",
    ],
  });
  const [userInput, setUserInput] = useState<string>("");

  /**
   * useEffect for fetching the correct log for the user. currently just simulate how it would go with fake data.
   */
  useEffect(() => {
    // we make a fetch, eventually our data will be in the following variable
    const res = true;
    // setData here
    setData({ logs: [] });

    if (res) setFound(true);
    setLoading(false);
  }, []);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // then it sends the message saved to 
    console.log(userInput)
  };

  if (loading) return <Loading />;
  else if (!found) return <NotFound />;
  else
    return data?.logs.length && data?.logs.length > 0 ? (
      <div className="min-h-full">
        {data?.logs.map((el, index) => (
          <div key={index}>{el}</div>
        ))}
      </div>
    ) : (
      <div className="min-h-full flex flex-col items-center justify-center">
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={sendMessage}
        >
          <h1 className="text-4xl">Let&apos;s Get Started</h1>
          <div className="flex gap-4 items-center">
            <AutoResizeTextarea maxLength={150} value={userInput} onChange={(e) => setUserInput(e.target.value)} />
            <Button
              variant="outline"
              size="icon"
              aria-label="Submit"
              type="submit"
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </form>
      </div>
    );
}
