import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching dashboard stats...');
      const response = await axios.get('/api/dashboard/stats/');
      console.log('Dashboard stats response:', response.data);
      if (response.data.success) {
        return response.data;
      } else {
        return rejectWithValue('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return rejectWithValue(error.message);
    }
  }
);
