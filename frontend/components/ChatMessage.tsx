"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTerminal } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

type MessageRole = "user" | "assistant";

export type Message = {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: string[];
};

type Props = {
  message: Message;
};

export function ChatMessage({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={clsx("chat", isUser ? "chat-end" : "chat-start")}>
      <div
        className={clsx(
          "chat-bubble",
          isUser ? "chat-bubble-primary" : "chat-bubble-neutral"
        )}
      >
        <div className="prose" style={{ color: isUser ? "#000" : "#000" }}>
          <div className="chat-image avatar">
            {isUser ? (
              <FontAwesomeIcon
                icon={faUser}
                className="text-base-content w-4 h-4"
              />
            ) : (
              <FontAwesomeIcon
                icon={faTerminal}
                className="text-primary w-4 h-4"
              />
            )}
            {(isUser ? "user : " : "bot : ") + message.content}
          </div>
        </div>
      </div>
      {!isUser && message.sources && message.sources.length > 0 && (
        <div className="chat-footer opacity-50 text-xs mt-1">
          <details>
            <summary>Sources</summary>
            <ul className="list-disc list-inside">
              {message.sources.map((source, index) => (
                <li key={index} className="truncate">
                  {source}
                </li>
              ))}
            </ul>
          </details>
        </div>
      )}
    </div>
  );
}
