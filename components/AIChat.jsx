"use client";
import "./AIChat.css";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollAreaRef = useRef(null);

  const {
    messages,
    sendMessage,
    status,
    stop,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isStreaming =
    status === "streaming" || status === "submitted";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const text = input.trim();

    if (!text || isStreaming) return;

    setInput("");

    await sendMessage({
      text,
    });
  };

  const handleScroll = () => {
    const element = scrollAreaRef.current;

    if (!element) return;

    const distanceFromBottom =
      element.scrollHeight -
      element.scrollTop -
      element.clientHeight;

    setIsAtBottom(distanceFromBottom < 80);
  };

  const scrollToBottom = () => {
    const element = scrollAreaRef.current;

    if (!element) return;

    element.scrollTo({
      top: element.scrollHeight,
      behavior: "smooth",
    });

    setIsAtBottom(true);
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  return (
    <div className="ai-chat">
      <div className="ai-chat-header">
        <div>
          <span className="ai-status-dot" />
          <div>
            <h1>Pixora AI</h1>
            <p>Photography Assistant</p>
          </div>
        </div>
      </div>

      <div
        ref={scrollAreaRef}
        className="ai-messages"
        onScroll={handleScroll}
      >
        {messages.length === 0 && (
          <div className="ai-empty-state">
            <h2>Ask Pixora AI</h2>
            <p>
              Get help with composition, lighting,
              camera settings, editing, and creative
              photography ideas.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`ai-message ${
              message.role === "user"
                ? "ai-message-user"
                : "ai-message-assistant"
            }`}
          >
            <div className="ai-message-label">
              {message.role === "user"
                ? "You"
                : "Pixora AI"}
            </div>

            <div className="ai-message-bubble">
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <span key={index}>
                      {part.text}
                    </span>
                  );
                }

                return null;
              })}
            </div>
          </div>
        ))}

        {status === "submitted" && (
          <div className="ai-thinking">
            <span />
            <span />
            <span />
            <p>Pixora AI is thinking...</p>
          </div>
        )}
      </div>

      {!isAtBottom && (
        <button
          type="button"
          className="jump-latest"
          onClick={scrollToBottom}
        >
          ↓ Jump to latest
        </button>
      )}

      <form
        className="ai-input-area"
        onSubmit={handleSubmit}
      >
        <textarea
          value={input}
          onChange={(event) =>
            setInput(event.target.value)
          }
          placeholder="Ask about photography..."
          rows={1}
          disabled={isStreaming}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey
            ) {
              event.preventDefault();
              handleSubmit(event);
            }
          }}
        />

        {isStreaming ? (
          <button
            type="button"
            className="stop-button"
            onClick={stop}
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            className="send-button"
            disabled={!input.trim()}
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}