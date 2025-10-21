import { useState, useEffect, useRef } from "react";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Button } from "../ui/button";
import { ArrowUpIcon } from "lucide-react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import Form from "next/form";
import { Input } from "../ui/input";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Log({ title }: { title: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [found, setFound] = useState<boolean>(false);
  const [data, setData] = useState<ChatMessage[] | null>([
    { role: "user", content: "What is the answer to question 3?" },
    {
      role: "assistant",
      content: "The answer to question 3 is apples (citation...)",
    },
    { role: "user", content: "What is the answer to question 4?" },
    {
      role: "assistant",
      content: "The answer to question 4 was not found in the text.",
    },
    { role: "user", content: "What is the answer to question 3?" },
    {
      role: "assistant",
      content: "The answer to question 3 is apples (citation...)",
    },
    { role: "user", content: "What is the answer to question 4?" },
    {
      role: "assistant",
      content: "The answer to question 4 was not found in the text.",
    },
    { role: "user", content: "What is the answer to question 3?" },
    {
      role: "assistant",
      content: "The answer to question 3 is apples (citation...)",
    },
    { role: "user", content: "What is the answer to question 4?" },
    {
      role: "assistant",
      content: "The answer to question 4 was not found in the text.",
    },
    { role: "user", content: "What is the answer to question 3?" },
    {
      role: "assistant",
      content: "The answer to question 3 is apples (citation...)",
    },
    { role: "user", content: "What is the answer to question 4?" },
    {
      role: "assistant",
      content: "The answer to question 4 was not found in the text.",
    },
  ]);
  const [newMessage, setNewMessage] = useState<string>("");

  /**
   * useEffect for fetching the correct log for the user. currently just simulate how it would go with fake data.
   */
  useEffect(() => {
    // we make a fetch, eventually our data will be in the following variable
    const res = true;
    // setData here

    if (res) setFound(true);
    setLoading(false);
  }, []);

  // Scroll to bottom when new messages are added
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // then it sends the message saved to
    console.log(newMessage);
  };

  if (loading) return <Loading />;
  else if (!found) return <NotFound />;
  else
    return data && data?.length > 0 ? (
      <div className="flex flex-col h-[calc(100vh-128px)]">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {data?.map((el, index) => (
            <div
              key={index}
              className={`flex w-full ${
                el.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${
                  el.role === "user"
                    ? "bg-blue-500/90 text-white"
                    : "bg-gray-200/90 dark:bg-gray-700/90 text-foreground"
                }`}
              >
                <p>{el.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {el.role === "user" ? "You" : "Assistant"} •{" "}
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-foreground/20 p-4">
          <Form action="/api/chat" className="flex gap-2 items-center">
            <Input
              type="text"
              name="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border border-foreground/20 bg-background/50 focus:outline-none focus:ring-2 focus:ring-foreground/30 transition-all duration-200"
            />
            <Button
              type="submit"
              className="bg-[#00A1FF] hover:bg-[#0088D4] px-4 py-2 text-white rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
            >
              Send
            </Button>
          </Form>
        </div>
      </div>
    ) : (
      <div className="min-h-full flex flex-col items-center justify-center">
        <form
          className="flex flex-col items-center justify-center gap-4"
          onSubmit={sendMessage}
        >
          <h1 className="text-4xl">Let&apos;s Get Started</h1>
          <div className="flex gap-4 items-center">
            <AutoResizeTextarea
              maxLength={150}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
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
