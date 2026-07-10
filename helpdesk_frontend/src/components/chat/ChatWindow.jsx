import React from "react";
import { Chat } from "../../features/chat";

export default function ChatWindow({ showChat, email, tempEmail, setTempEmail, handleSaveEmail, onClose }) {
  if (!showChat) return null;

  return (
    <div className="chat-window">
      {email ? (
        <Chat userEmail={email} onClose={onClose} />
      ) : (
        <div className="email-popup-content">
          <h3>Enter your email to start chatting</h3>
          <input
            type="email"
            placeholder="you@example.com"
            value={tempEmail}
            onChange={(e) => setTempEmail(e.target.value)}
          />
          <button onClick={handleSaveEmail}>Start Chat</button>
        </div>
      )}
    </div>
  );
}
