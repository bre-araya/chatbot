import { createAsyncThunk } from '@reduxjs/toolkit';
import accountService from '../../services/chat/accountService';

export const createAccountThunk = createAsyncThunk(
  'account/create',
  async (accountData, { rejectWithValue }) => {
    try {
      const response = await accountService.createAccount(accountData);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
