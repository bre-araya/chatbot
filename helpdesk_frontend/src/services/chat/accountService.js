import axios from './api';

const createAccount = async (accountData) => {
  try {
    const response = await axios.post('/accounts/create', accountData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default {
  createAccount,
};
