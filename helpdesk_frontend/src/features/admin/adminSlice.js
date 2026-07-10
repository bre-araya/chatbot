import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardStats } from "./adminThunks";

const initialState = {
  dashboardStats: {
    total_chats: 0,
    open_tickets: 0,
    new_users: 0,
    active_agents: 0
  },
  status: "idle", // 'idle' | 'loading' | 'error'
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.status = "idle";
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      });
  }
});

export default adminSlice.reducer;
