import axios from '../chat/api';

export const createAccount = async (accountData) => {
  try {
    const data = {
      ...accountData,
      confirm_password: accountData.confirmPassword
    };
    delete data.confirmPassword;
    const response = await axios.post('/accounts/create/', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllAccounts = async () => {
  try {
    const response = await axios.get('/accounts/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const forgotPassword = async (forgotData) => {
  try {
    const response = await axios.post('/accounts/forgot_password/', forgotData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post('/accounts/reset_password/', resetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
