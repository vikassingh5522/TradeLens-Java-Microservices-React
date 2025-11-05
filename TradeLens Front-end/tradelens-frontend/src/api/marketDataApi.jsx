import axios from "axios";

const BASE_URL = "http://localhost:8083/marketdata";

export const getPrice = async (symbol) => {
  try {
    const res = await axios.get(`${BASE_URL}/price/${symbol}`);
    return res.data;
  } catch (err) {
    console.error("❌ Failed to fetch market data:", err);
    throw err;
  }
};
