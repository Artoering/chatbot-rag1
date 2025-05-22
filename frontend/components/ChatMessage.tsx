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
      <div className="chat-image avatar">
        <div className="w-8 rounded-full bg-base-300 p-1.5">
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
        </div>
      </div>
      <div
        className={clsx(
          "chat-bubble",
          isUser ? "chat-bubble-primary" : "chat-bubble-neutral"
        )}
      >
        <div className="prose">
          {(isUser ? "user : " : "bot : ") + message.content}
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
