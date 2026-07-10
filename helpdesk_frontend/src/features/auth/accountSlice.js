import { createSlice } from '@reduxjs/toolkit';
import { createAccountThunk } from './accountThunks';

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createAccountThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create account';
      });
  },
});

export const { resetState } = accountSlice.actions;

export default accountSlice.reducer;
