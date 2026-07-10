import React from "react";
import { useDispatch, useSelector } from "react-redux";
import useChat from "./hooks/useChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import TicketForm from "../../components/chat/TicketForm";
import TicketsList from "../../components/chat/TicketsList";
import HistoryList from "../../components/chat/HistoryList";
import { fetchHistoryAsync } from "./chatThunks";
import { fetchTicketsByEmail } from "./ticketThunks";
import "../../style/chat/chat.css";

export default function Chat({ userEmail, onClose }) {
  const { messages, input, setInput, handleSend } = useChat(userEmail);
  const dispatch = useDispatch();
  const { showTicketsView, showHistoryView, tickets, history } = useSelector((state) => state.chat);

  const handleHistoryClick = () => {
    dispatch(fetchHistoryAsync(userEmail));
  };

  const handleTicketClick = () => {
    dispatch(fetchTicketsByEmail(userEmail));
  };

  return (
    <div className="chat-window">
      <ChatHeader onHistoryClick={handleHistoryClick} onTicketClick={handleTicketClick} onClose={onClose} />
      {showTicketsView ? (
        <TicketsList tickets={tickets} />
      ) : showHistoryView ? (
        <HistoryList history={history} />
      ) : (
        <>
          <TicketForm />
          <ChatMessages messages={messages} onSelectMessage={() => {}} />
          <ChatInput input={input} setInput={setInput} handleSend={handleSend} />
        </>
      )}
    </div>
  );
}
