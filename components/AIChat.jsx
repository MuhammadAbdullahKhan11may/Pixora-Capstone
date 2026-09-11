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

  const renderToolPart = (part, index) => {
    const isAnalyzeTool =
      part.type === "tool-analyzePhotographyIdea";

    if (!isAnalyzeTool) return null;

    // 1. Input streaming
    if (part.state === "input-streaming") {
      return (
        <div
          key={index}
          className="tool-card tool-streaming"
        >
          <div className="tool-icon">⚙️</div>

          <div>
            <h3>Preparing analysis...</h3>
            <p>
              Pixora AI is preparing the photography
              idea for analysis.
            </p>
          </div>
        </div>
      );
    }

    // 2. Input available
    if (part.state === "input-available") {
      return (
        <div
          key={index}
          className="tool-card tool-input"
        >
          <div className="tool-icon">🔍</div>

          <div>
            <h3>Analyzing photography idea</h3>

            <p className="tool-input-text">
              {part.input?.idea ||
                "Photography concept received"}
            </p>
          </div>
        </div>
      );
    }

    // 3. Output available
    if (part.state === "output-available") {
      const result = part.output;

      return (
        <div
          key={index}
          className="tool-card tool-success"
        >
          <div className="tool-result-header">
            <div>
              <span className="tool-result-label">
                Photography Analysis
              </span>

              <h3>{result?.category}</h3>
            </div>

            <div className="tool-score">
              {result?.score}
              <span>/100</span>
            </div>
          </div>

          <div className="tool-stat">
            <span>Word Count</span>
            <strong>{result?.wordCount}</strong>
          </div>

          <div className="tool-findings">
            <h4>Findings</h4>

            {result?.findings?.map(
              (finding, findingIndex) => (
                <div
                  key={findingIndex}
                  className="tool-finding"
                >
                  <span>✓</span>
                  <p>{finding}</p>
                </div>
              )
            )}
          </div>
        </div>
      );
    }

    // 4. Output error
    if (part.state === "output-error") {
      return (
        <div
          key={index}
          className="tool-card tool-error"
        >
          <div className="tool-icon">⚠️</div>

          <div>
            <h3>Analysis failed</h3>

            <p>
              {part.errorText ||
                "Pixora AI could not analyze this photography idea. Please try again."}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

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

            <div className="tool-demo-hint">
              Try:
              <br />
              <strong>
                Analyze my photography idea: a cinematic
                portrait at sunset using warm backlighting
                and shallow depth of field.
              </strong>
            </div>
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

                return renderToolPart(part, index);
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