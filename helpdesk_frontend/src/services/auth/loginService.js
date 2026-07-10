import axios from '../chat/api';

export const login = async (email, password) => {
  try {
    const response = await axios.post('/accounts/login/', { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
