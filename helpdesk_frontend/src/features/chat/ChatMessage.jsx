import React from "react";
import "../../style/chat/chat.css";

export default function ChatMessage({ message, onSelect }) {
  const { sender, text, timestamp } = message;

  // Conditional styling: user vs bot
  const messageClass = sender === "user" ? "chat-message user" : "chat-message bot";

  return (
    <div className={messageClass} onClick={() => onSelect(message)}>
      <div className="message-text">{text}</div>
      {timestamp && <div className="timestamp">{new Date(timestamp).toLocaleString()}</div>}
    </div>
  );
}
