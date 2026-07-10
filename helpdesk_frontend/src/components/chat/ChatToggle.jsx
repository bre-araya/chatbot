import React from "react";

export default function ChatToggle({ onClick, showChat }) {
  return (
    <button
      className="chat-button-fixed"
      onClick={onClick}
      aria-label={showChat ? "Close Chat" : "Open Chat"}
    >
      {showChat ? "✕" : "Helpdesk❓"}
    </button>
  );
}
