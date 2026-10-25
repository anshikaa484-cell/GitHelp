import React from "react";

// Renders text, converting `backtick` segments into inline <code>.
function renderRich(text) {
  const parts = text.split(/(`[^`]+`)/g);
  return parts.map((part, i) => {
    const key = `${part}-${i}`;
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>;
    }
    return <span key={key}>{part}</span>;
  });
}

export const ChatBubble = ({ role, text }) => {
  return (
    <div className={`bubble ${role}`} data-testid={`chat-bubble-${role}`}>
      {renderRich(text)}
    </div>
  );
};

export default ChatBubble;
