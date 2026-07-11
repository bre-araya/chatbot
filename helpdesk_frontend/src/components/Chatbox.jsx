import { useState } from "react";
import "../styles/Chatbox.css";

function Chatbox() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you with your ride today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot/get-response/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { from: "bot", text: data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { from: "bot", text: "Sorry, I couldn't connect to the helpdesk service." }]);
    }

    setInput("");
  };

  return (
    <div className="chatbox">
      <div className="chatbox-header">
        <div>
          <div className="title">SmartRide Helpdesk</div>
          <div className="subtitle">Ask about your ride, payment, or driver status.</div>
        </div>
        <div className="status-pill">Online</div>
      </div>

      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.from === "user" ? "user" : "bot"}`}>
            {m.text}
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chatbox;
