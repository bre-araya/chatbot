import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideTicketsView } from "../../features/chat/chatSlice";

export default function TicketsList({ tickets }) {
  const dispatch = useDispatch();

  const handleBackToChat = () => {
    dispatch(hideTicketsView());
  };

  return (
    <div className="tickets-list">
      <h3>Your Tickets</h3>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.ticket_id}>
              <strong>{ticket.question}</strong><br />
              Status: {ticket.status}<br />
              Created At: {new Date(ticket.created_at).toLocaleString()}
              {ticket.status === 'resolved' && ticket.answer && (
                <>
                  <br />
                  <strong>Answer:</strong> {ticket.answer}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleBackToChat}>Back to Chat</button>
    </div>
  );
}
