import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMessages, sendMessage, createTicket } from "../../services/chat/chatService";

// Fetch chat messages
export const fetchMessagesAsync = createAsyncThunk(
  "chat/fetchMessages",
  async (userEmail) => {
    const response = await fetchMessages(userEmail);
    return response.data;
  }
);

// Send chat message
export const sendMessageAsync = createAsyncThunk(
  "chat/sendMessage",
  async ({ message, session_id = null, email = null }) => {
    const response = await sendMessage(message, session_id, email);
    return response.data;
  }
);

// Fetch chat history
export const fetchHistoryAsync = createAsyncThunk(
  "chat/fetchHistory",
  async (userEmail) => {
    const response = await fetchMessages(userEmail);
    // Map backend response to expected frontend format
    if (response.data && response.data.success && response.data.messages) {
      // Transform messages to have id, sender, text, timestamp
      const messages = response.data.messages.map((msg, index) => ({
        id: index + 1,
        sender: msg.is_user ? "user" : "bot",
        text: msg.message,
        timestamp: msg.created_at
      }));
      return messages;
    }
    return [];
  }
);

// Create ticket
export const createTicketAsync = createAsyncThunk(
  "chat/createTicket",
  async (ticketData) => {
    const response = await createTicket(ticketData);
    return response.data;
  }
);
