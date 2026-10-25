import React, { useRef, useEffect } from "react";
import { Bot, Send, Volume2 } from "lucide-react";
import ChatBubble from "./ChatBubble";
import VoiceButton from "./VoiceButton";

// Presentational chat window: message list + input. Logic lives in the Chatbot page.
export const ChatWindow = ({
  messages,
  input,
  onInputChange,
  onSend,
  suggestions = [],
  onSuggestion,
  headerAction = null,
  onSpeakMessage,
  canSpeak = false,
}) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend();
  };

  return (
    <div className="chat-window" data-testid="chat-window">
      <div className="chat-header">
        <span className="chat-avatar">
          <Bot size={22} />
        </span>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: 0 }}>Git Assistant</h4>
          <span className="chat-status">
            <span className="live" /> Rule-based · always available
          </span>
        </div>
        {headerAction}
      </div>

      <div className="chat-messages" data-testid="chat-messages">
        {messages.map((m) => (
          <div key={m.id} className={`bubble-row ${m.role}`}>
            <ChatBubble role={m.role} text={m.text} />
            {m.role === "bot" && canSpeak && onSpeakMessage && (
              <button
                type="button"
                className="speak-msg"
                onClick={() => onSpeakMessage(m.text)}
                aria-label="Read this answer aloud"
                data-testid={`speak-msg-${m.id}`}
                title="Read aloud"
              >
                <Volume2 size={14} />
              </button>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && (
        <div className="suggest-chips" data-testid="chat-suggestions">
          {suggestions.map((s) => (
            <button
              key={s}
              className="chip"
              onClick={() => onSuggestion(s)}
              data-testid={`suggestion-${s.slice(0, 12).replace(/\s+/g, "-")}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          placeholder="Ask a Git question…"
          onChange={(e) => onInputChange(e.target.value)}
          aria-label="Chat message"
          data-testid="chat-input"
        />
        <VoiceButton
          onTranscript={(t) => onInputChange(input ? input + " " + t : t)}
          title="Ask by voice"
          size={18}
        />
        <button
          type="submit"
          className="send-btn"
          aria-label="Send message"
          data-testid="chat-send"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
