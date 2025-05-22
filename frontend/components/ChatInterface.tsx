"use client";

import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { ChatMessage, type Message } from "./ChatMessage";
import { nanoid } from "nanoid";
import axios from "axios";
import clsx from "clsx";

type Props = {
  tenantId: string | null;
};

export function ChatInterface({ tenantId }: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId || !input.trim() || isLoading) return;

    const userMessage: Message = {
      id: nanoid(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/${tenantId}/chat`, {
        params: {
          query: userMessage.content,
        },
      });

      const assistantMessage: Message = {
        id: nanoid(),
        role: "assistant",
        content: response.data.answer,
        timestamp: response.data.timestamp,
        sources: response.data.sources,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get response");
      console.error("Chat error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[50vh] bg-[#E4DDD6]">
      {" "}
      {/* WhatsApp background color */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="container mx-auto max-w-4xl space-y-1">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4">
          <span>{error}</span>
        </div>
      )}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-green-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            className={clsx(
              "rounded-full p-2",
              input.trim() ? "bg-green-500 hover:bg-green-600" : "bg-gray-300",
              "transition-colors duration-200"
            )}
            disabled={isLoading || !input.trim()}
          >
            <FontAwesomeIcon
              icon={faPaperPlane}
              className="h-6 w-6 text-white"
            />
          </button>
        </form>
      </div>
    </div>
  );
}
