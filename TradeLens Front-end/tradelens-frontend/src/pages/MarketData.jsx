// ✅ src/pages/MarketData.jsx
import { useState } from "react";
import { getPrice } from "../api/marketDataApi";
import Navbar from "../components/Navbar";
import Sidebar from "../Components/Sidebar";

export default function MarketData() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch latest price from backend service
  const fetchPrice = async () => {
    if (!symbol.trim()) {
      alert("Please enter a stock symbol, e.g. AAPL or TSLA");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const priceData = await getPrice(symbol.toUpperCase());
      setData(priceData);
    } catch (err) {
      setError("Failed to fetch market data. Please check backend logs or connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar + Navbar for layout */}
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            📈 Market Data Dashboard
          </h2>

          {/* ---------- Search Section ---------- */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="border border-gray-300 p-2 rounded w-48 focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              onClick={fetchPrice}
              disabled={loading}
              className={`px-4 py-2 rounded text-white font-semibold ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Fetching..." : "Get Price"}
            </button>
          </div>

          {/* ---------- Error Message ---------- */}
          {error && (
            <p className="text-red-600 font-medium mb-4">
              ❌ {error}
            </p>
          )}

          {/* ---------- Market Data Display ---------- */}
          {data && (
            <div className="border border-gray-300 bg-gray-50 rounded-lg p-4 shadow-sm max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {data.symbol}
              </h3>
              <p className="text-lg text-blue-700 font-bold">
                💵 Current Price: ${data.price?.toFixed(2)}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                ⏱ Updated:{" "}
                {new Date(data.timestamp).toLocaleString("en-US", {
                  hour12: true,
                })}
              </p>
            </div>
          )}

          {/* ---------- Optional Note ---------- */}
          {!data && !error && !loading && (
            <p className="text-gray-500 italic">
              Enter a stock symbol and click "Get Price" to fetch live data.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
