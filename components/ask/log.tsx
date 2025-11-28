import { useState, useEffect, useRef } from "react";
import NotFound from "@/app/not-found";
import Loading from "@/app/loading";
import { Button } from "../ui/button";
import { ArrowUpIcon, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { AutoResizeTextarea } from "./auto-resize-textarea";
import { Input } from "../ui/input";
import { motion, AnimatePresence } from "framer-motion";
import ErrorBanner from "../global/error-banner";
import type { Message } from "@prisma/client";

interface VectorResult {
  text: string;
  similarity: number;
}

interface ChatMessage {
  role: "USER" | "AGENT";
  content: string;
  timestamp: string;
}

export default function Log({ title }: { title: string }) {
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(true);
  const [localError, setLocalError] = useState(false);
  const [localErrorText, setLocalErrorText] = useState(
    "We ran into an error fetching the chat log. Please try again later."
  );
  const [data, setData] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [latestVectors, setLatestVectors] = useState<VectorResult[]>([]);
  const [showVectors, setShowVectors] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch(`/api/ask/${title}`, { method: "GET" });
        const result = await res.json();
        if (res.status === 404) setFound(false);
        if (!res.ok) throw result.error;

        setData(
          result.payload.messages.map((el: Message) => ({
            role: el.role,
            content: el.text,
            timestamp: el.createdAt
          }))
        );

        setLocalError(false);
        setLoading(false);
        setFound(true);
      } catch (error) {
        console.error(error);
        setLocalError(true);
        setLocalErrorText(String(error));
        setLoading(false);
      }
    };

    fetchLogs();
  }, [title]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data]);

  const sendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;

    try {
      setSending(true);

      const message = newMessage;
      setNewMessage("");

      // add user message
      setData((prev) => [
        ...prev,
        {
          content: message,
          role: "USER",
          timestamp: new Date().toISOString()
        }
      ]);

      const res = await fetch(`/api/ask/${title}`, {
        method: "POST",
        body: JSON.stringify({ prompt: message }),
        headers: { "Content-Type": "application/json" }
      });

      const result = await res.json();
      if (res.status === 404) setFound(false);
      if (!res.ok) throw result.error;

      // update citation for latest response. currently only supporting showing the citations for the latest prompt, they are not stored anywhere
      // @ts-expect-error not dealing with making a type for the vectors returned
      setLatestVectors(result.payload.citation.map((el) => {
        return {
          text: el.fields.text,
          similarity: el._score,
        }
      }));
      setShowVectors(false); // reset to collapsed state

      // add assistant response
      setData((prev) => [
        ...prev,
        {
          content: result.payload.response.text,
          role: result.payload.response.role,
          timestamp: result.payload.response.createdAt
        }
      ]);

      setLocalError(false);
      setFound(true);
    } catch (error) {
      console.error(error);
      setLocalError(true);
      setLocalErrorText(String(error));
    } finally {
      setSending(false);
    }
  };

  if (loading) return <Loading />;
  if (!found) return <NotFound />;

  return data.length > 0 ? (
    <div className="flex flex-col h-[calc(100vh-128px)]">
      {localError && <ErrorBanner text={localErrorText} />}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        <AnimatePresence mode="popLayout">
          {data.map((el, index) => {
            const isLatestAssistant =
              el.role === "AGENT" && index === data.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`flex w-full ${el.role === "USER" ? "justify-end" : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 text-sm shadow-sm ${el.role === "USER"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border"
                    }`}
                >
                  <p>{el.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {el.role === "USER" ? "You" : "Assistant"} •{" "}
                    {new Date(el.timestamp).toLocaleTimeString()}
                  </p>

                  {/* Vector Results - Only for latest assistant message */}
                  {isLatestAssistant && latestVectors.length > 0 && (
                    <div className="mt-3 border-t pt-2">
                      <button
                        onClick={() => setShowVectors(!showVectors)}
                        className="flex items-center gap-1 text-xs font-medium hover:opacity-70 transition-opacity"
                      >
                        {showVectors ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )}
                        View Sources ({latestVectors.length} vectors)
                      </button>

                      <AnimatePresence>
                        {showVectors && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 space-y-2">
                              {latestVectors.map((vector, idx) => (
                                <div
                                  key={idx}
                                  className="text-xs p-2 rounded bg-background/50 border"
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-muted-foreground">
                                      Vector {idx + 1}
                                    </span>
                                    <span className="text-xs font-mono text-primary">
                                      {vector.similarity.toFixed(4)}
                                    </span>
                                  </div>
                                  <p className="text-muted-foreground leading-relaxed">
                                    {vector.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t p-4 bg-card/50 backdrop-blur-sm">
        <form onSubmit={sendMessage} className="flex gap-2 items-center">
          <Input
            type="text"
            maxLength={175}
            name="message"
            disabled={sending}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={sending ? "Sending..." : "Type your message..."}
            className="flex-1 disabled:opacity-50"
          />
          <Button
            type="submit"
            disabled={sending || newMessage.trim() === ""}
            className="shadow-md hover:shadow-lg transition-all disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </Button>
        </form>
      </div>
    </div>
  ) : (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-full flex flex-col items-center justify-center"
    >
      {localError && <ErrorBanner text={localErrorText} />}

      <form
        className="flex flex-col items-center justify-center gap-6"
        onSubmit={sendMessage}
      >
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 text-primary" />
          <h1 className="text-4xl font-bold">Let&apos;s Get Started</h1>
        </div>
        <p className="text-muted-foreground mb-4">
          Ask me anything about this document
        </p>
        <div className="flex gap-4 items-end">
          <AutoResizeTextarea
            maxLength={175}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your question here..."
            disabled={sending}
            className="disabled:opacity-50"
          />
          <Button
            variant="default"
            size="icon"
            aria-label="Submit"
            type="submit"
            className="mb-1 disabled:opacity-50"
            disabled={sending || newMessage.trim() === ""}
          >
            <ArrowUpIcon />
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
