import { useState } from "react";
import "../styles/Chatbox.css";

function Chatbox() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! How can I help you?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();
    const newMessage = { from: "user", text: input };
    setMessages([...messages, newMessage]);

    // Call Django API chatbot endpoint
    const res = await fetch("http://127.0.0.1:8000/chatbot/get-response/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { from: "bot", text: data.response }]);
    setInput("");
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.from === "user" ? "user" : "bot"}`}
          >
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
