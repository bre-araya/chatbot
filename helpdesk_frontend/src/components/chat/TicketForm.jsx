import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideTicketForm } from "../../features/chat/chatSlice";
import { createTicketAsync } from "../../features/chat/chatThunks";
import "../../style/chat/chat.css";

export default function TicketForm() {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.chat.showTicketForm);
  const sessionId = useSelector((state) => state.chat.currentSessionId);
  const messages = useSelector((state) => state.chat.messages);

  const userEmail = useSelector((state) => state.chat.email);

  const [formData, setFormData] = useState({
    name: "",
    email: userEmail || "",
    phone: "",
    question: "",
  });

  const [submitted, setSubmitted] = useState(false);

  // Pre-fill question with last user message
  useEffect(() => {
    if (show && messages.length > 0) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.sender === "user");
      if (lastUserMessage) {
        setFormData(prev => ({
          ...prev,
          question: lastUserMessage.text
        }));
      }
    }
  }, [show, messages]);

  if (!show) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      alert("Email is required. Please enter your email.");
      return;
    }
    if (!sessionId) {
      alert("Session not found. Please start a chat first.");
      return;
    }
    dispatch(createTicketAsync({ ...formData, session_id: sessionId }));
    setSubmitted(true);
  };

  const handleCancel = () => {
    dispatch(hideTicketForm());
  };

  const handleClose = () => {
    dispatch(hideTicketForm());
  };

  return (
    <div className="ticket-form">
      <h3>Create Support Ticket</h3>
      {submitted ? (
        <div className="success-message">
          <p>Thank you! Your support ticket has been submitted successfully.</p>
          <p>Our team will review your request and get back to you soon.</p>
          <div className="form-buttons">
            <button type="button" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-row">
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
          </div>
          <div className="form-row">
            <label>
              Phone:
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </label>
          </div>
        <label>
          Question:
          <textarea
            name="question"
            value={formData.question}
            readOnly
            required
          />
        </label>
          <div className="form-buttons">
            <button type="submit">Submit Ticket</button>
            <button type="button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
