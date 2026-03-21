import axios from "axios";

const host = process.env.REACT_APP_BACKEND_URL;

export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;

export const addTransaction = async (data) => {
  try {
    const res = await axios.post(`${host}/api/transactions`, data);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};

export const getTransactions = async () => {
  try {
    const res = await axios.get(`${host}/api/transactions`);
    return res.data;
  } catch (err) {
    console.error(err);
  }
};