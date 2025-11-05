import axios from "axios";

const BASE_URL = "http://localhost:8080/analytics"; 

export const getRiskReport = async (userId) => {
  const res = await axios.get(`${BASE_URL}/risk/${userId}`);
  return res.data;
};

export const getRiskHistory = async (userId) => {
  const res = await axios.get(`${BASE_URL}/history/${userId}`);
  return res.data;
};
