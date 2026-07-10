import React from "react";
import { useDispatch } from "react-redux";
import { hideHistoryView } from "../../features/chat/chatSlice";

export default function HistoryList({ history }) {
  const dispatch = useDispatch();

  const handleBackToChat = () => {
    dispatch(hideHistoryView());
  };

  return (
    <div className="history-list">
      <h3>Your Chat History</h3>
      {history.length === 0 ? (
        <p>No history found.</p>
      ) : (
        <ul>
          {history.map((msg) => (
            <li key={msg.id}>
              <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}<br />
              <small>{new Date(msg.timestamp).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleBackToChat}>Back to Chat</button>
    </div>
  );
}
