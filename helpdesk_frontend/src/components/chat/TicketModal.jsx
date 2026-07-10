import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideTicketModal } from "../../features/chat/chatSlice";
import { createTicketAsync } from "../../features/chat/chatThunks";
import "../../style/chat/chat.css";

export default function TicketModal() {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.chat.showTicketModal);
  const sessionId = useSelector((state) => state.chat.currentSessionId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    question: "",
  });

  if (!show) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTicketAsync({ ...formData, session: sessionId }));
    dispatch(hideTicketModal());
  };

  const handleClose = () => {
    dispatch(hideTicketModal());
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Support Ticket</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Question:
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
            />
          </label>
          <div className="modal-buttons">
            <button type="submit">Submit Ticket</button>
            <button type="button" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
