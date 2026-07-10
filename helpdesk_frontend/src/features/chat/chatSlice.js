import { createSlice } from "@reduxjs/toolkit";
import { sendMessageAsync, fetchMessagesAsync, fetchHistoryAsync, createTicketAsync } from "./chatThunks";
import { fetchTicketsByEmail } from "./ticketThunks";

const initialState = {
  messages: [
    {
      id: 1,
      sender: "bot",
      text: "Hello, how can I help you today?",
      timestamp: new Date().toISOString()
    }
  ],   // all chat messages with default message
  status: "idle", // 'idle' | 'loading' | 'error'
  error: null,
  showChat: false,
  email: '',
  tempEmail: '',
  showTicketForm: false,
  currentSessionId: null,
  tickets: [],
  showTicketsView: false,
  showHistoryView: false,
  history: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    toggleChat: (state) => {
      state.showChat = !state.showChat;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setTempEmail: (state, action) => {
      state.tempEmail = action.payload;
    },
    saveEmail: (state) => {
      if (state.tempEmail.trim()) {
        state.email = state.tempEmail;
        state.tempEmail = '';
        state.showChat = true;
      }
    },
    showTicketForm: (state, action) => {
      state.showTicketForm = true;
      state.currentSessionId = action.payload.sessionId;
    },
    hideTicketForm: (state) => {
      state.showTicketForm = false;
      state.currentSessionId = null;
    },
    showTicketsView: (state) => {
      state.showTicketsView = true;
      state.showHistoryView = false;
    },
    hideTicketsView: (state) => {
      state.showTicketsView = false;
    },
    showHistoryView: (state) => {
      state.showHistoryView = true;
      state.showTicketsView = false;
    },
    hideHistoryView: (state) => {
      state.showHistoryView = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessagesAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessagesAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.messages = action.payload;
      })
      .addCase(fetchMessagesAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(sendMessageAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendMessageAsync.fulfilled, (state, action) => {
        state.status = "idle";
        if (action.payload && action.payload.reply) {
          state.messages.push({
            id: Date.now(),
            sender: "bot",
            text: action.payload.reply,
            timestamp: new Date().toISOString()
          });
          // Check for escalation
          if (action.payload.status === 'escalation' || action.payload.create_ticket) {
            state.showTicketForm = true;
            state.currentSessionId = action.payload.session_id;
          }
        }
      })
      .addCase(sendMessageAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchHistoryAsync.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHistoryAsync.fulfilled, (state, action) => {
        state.status = "idle";
        state.history = action.payload; // Store history separately
        state.showHistoryView = true;
        state.showTicketsView = false;
      })
      .addCase(fetchHistoryAsync.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchTicketsByEmail.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTicketsByEmail.fulfilled, (state, action) => {
        state.status = "idle";
        state.tickets = action.payload;
        state.showTicketsView = true;
        state.showHistoryView = false;
      })
      .addCase(fetchTicketsByEmail.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  }
});

export const { addMessage, clearMessages, toggleChat, setEmail, setTempEmail, saveEmail, showTicketForm, hideTicketForm, showTicketsView, hideTicketsView, showHistoryView, hideHistoryView } = chatSlice.actions;
export default chatSlice.reducer;
