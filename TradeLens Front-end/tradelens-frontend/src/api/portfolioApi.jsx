import axios from "axios";
const BASE_URL = "http://localhost:8080/portfolio";

export const addTransaction = (data, token) =>
  axios.post(`${BASE_URL}/add`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getHoldings = (token) =>
  axios.get(`${BASE_URL}/holdings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
