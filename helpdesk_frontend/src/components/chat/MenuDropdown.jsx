import React, { useState } from "react";

export default function MenuDropdown({ onHistoryClick, onTicketClick }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleTicket = () => {
    setIsOpen(false);
    if (onTicketClick) {
      onTicketClick();
    }
  };

  const handleHistory = () => {
    setIsOpen(false);
    if (onHistoryClick) {
      onHistoryClick();
    }
  };

  return (
    <div className="menu-dropdown">
      <button className="menu-button" onClick={toggleMenu} aria-label="Menu">
        ⋮
      </button>
      {isOpen && (
        <div className="menu-content">
          <button onClick={handleTicket}>Ticket</button>
          <button onClick={handleHistory}>History</button>
        </div>
      )}
    </div>
  );
}
