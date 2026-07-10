import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/chat/api";

export const fetchTicketsByEmail = createAsyncThunk(
  "chat/fetchTicketsByEmail",
  async (email) => {
    const response = await api.get("/tickets/", { params: { email } });
    return response.data.tickets;
  }
);
