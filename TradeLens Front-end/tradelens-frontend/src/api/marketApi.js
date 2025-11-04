// // ✅ src/api/marketApi.js
// import axios from "axios";

// // Yahoo Finance API via RapidAPI
// const API_HOST = "https://yfapi.net";
// const API_KEY = "YOUR_RAPIDAPI_KEY"; // 🔑 Replace this with your actual RapidAPI key

// /**
//  * Fetch live stock price by symbol
//  * @param {string} symbol - Stock symbol (e.g. "AAPL")
//  * @returns {number|null} - Latest price or null if not available
//  */
// export const getLivePrice = async (symbol) => {
//   try {
//     const res = await axios.get(`${API_HOST}/v6/finance/quote`, {
//       params: { symbols: symbol.toUpperCase() },
//       headers: {
//         "x-api-key": API_KEY,
//       },
//     });

//     const quote = res.data?.quoteResponse?.result?.[0];
//     if (!quote) {
//       console.warn(`⚠️ No data found for symbol: ${symbol}`);
//       return null;
//     }

//     return quote.regularMarketPrice ?? null;
//   } catch (err) {
//     console.error(`❌ Error fetching live price for ${symbol}:`, err.message);
//     return null;
//   }
// };
