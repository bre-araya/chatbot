import React from "react";
import { useSelector } from "react-redux";
import Input from "../../components/chat/Input";
import Button from "../../components/chat/Button";

export default function ChatInput({ input, setInput, handleSend }) {
  const status = useSelector((state) => state.chat.status);
  const loading = status === "loading";

  return (
    <div className="chat-input">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask A Question..."
        disabled={loading}
        onKeyDown={(e) => e.key === "Enter" && !loading && handleSend()}
      />
      <Button onClick={handleSend} loading={loading}>send</Button>
    </div>
  );
}
