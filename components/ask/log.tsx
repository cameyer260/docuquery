import { useState, useEffect, useRef } from "react";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Button } from "../ui/button";
import { ArrowUpIcon, Sparkles } from "lucide-react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import Form from "next/form";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBanner from "../global/error-banner";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function Log({ title }: { title: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [found, setFound] = useState<boolean>(true);
  const [localError, setLocalError] = useState<boolean>(false);
  const [localErrorText, setLocalErrorText] = useState<string>("We ran into an error fetching the chat log. Please try again later.");
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
  ]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [triggerRefetch, setTriggerRefetch] = useState<boolean>(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/ask/${title}`, {
          method: "GET"
        });
        const result = await res.json();
        if (res.status === 404) setFound(false);
        if (!res.ok) throw result.error;

        console.log(result);
        // TODO loop data returned and update local data

        setLocalError(false);
        setLocalErrorText("We ran into an error fetching the chat log. Please try again later.");
        setLoading(false);
        setFound(true);
      } catch (error) {
        console.error(error);
        setLocalError(true);
        setLocalErrorText(error as string);
        setLoading(false);
      }
    }

    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerRefetch]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  /**
   * send the message to /api/ask/filename. POST request
   */
  const sendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(newMessage);
    setTriggerRefetch(!triggerRefetch);
  };

  if (loading) return <Loading />;
  else if (!found) return <NotFound />;
  else
    return data && data?.length > 0 ? (
      <div className="flex flex-col h-[calc(100vh-128px)]">
        {localError && (
          <ErrorBanner text={localErrorText} />
        )}
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {data?.map((el, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex w-full ${el.role === "user" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${el.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                    }`}
                >
                  <p>{el.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {el.role === "user" ? "You" : "Assistant"} •{" "}
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t p-4 bg-card/50 backdrop-blur-sm">
          <Form action="/api/chat" className="flex gap-2 items-center">
            <Input
              type="text"
              name="message"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button
              type="submit"
              className="shadow-md hover:shadow-lg transition-all"
            >
              Send
            </Button>
          </Form>
        </div>
      </div>
    ) : (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-full flex flex-col items-center justify-center"
      >
        {localError && (
          <ErrorBanner text={localErrorText} />
        )}
        <form
          className="flex flex-col items-center justify-center gap-6"
          onSubmit={sendMessage}
        >
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold">Let&apos;s Get Started</h1>
          </div>
          <p className="text-muted-foreground mb-4">Ask me anything about this document</p>
          <div className="flex gap-4 items-end">
            <AutoResizeTextarea
              maxLength={150}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your question here..."
            />
            <Button
              variant="default"
              size="icon"
              aria-label="Submit"
              type="submit"
              className="mb-1"
            >
              <ArrowUpIcon />
            </Button>
          </div>
        </form>
      </motion.div>
    );
}
