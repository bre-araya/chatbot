import React, { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatMessages({ messages, onSelectMessage }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} onSelect={onSelectMessage} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
