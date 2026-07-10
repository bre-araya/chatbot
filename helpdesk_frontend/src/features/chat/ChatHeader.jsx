import React from "react";
import MenuDropdown from "../../components/chat/MenuDropdown";

export default function ChatHeader({ onHistoryClick, onTicketClick, onClose }) {
  return (
    <div className="chat-header">
      <span>Helpdesk Chat</span>
      <div className="chat-header-actions">
        <MenuDropdown onHistoryClick={onHistoryClick} onTicketClick={onTicketClick} />
        <button className="close-button" onClick={onClose} aria-label="Close Chat">
          ✕
        </button>
      </div>
    </div>
  );
}
