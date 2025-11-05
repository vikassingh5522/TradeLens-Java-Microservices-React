import { useState, useEffect } from "react";
import { getPrice } from "../api/marketDataApi";
import Navbar from "../components/Navbar";
import Sidebar from "../Components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MarketData() {
  const [symbol, setSymbol] = useState("");
  const [data, setData] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("marketHistory");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [live, setLive] = useState(false);
  const [filter, setFilter] = useState("");
  const [lastPrice, setLastPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);

  // Random finance background image for better visual impact
  const bannerImage = `https://source.unsplash.com/1600x400/?finance,stocks,market`;

  useEffect(() => {
    localStorage.setItem("marketHistory", JSON.stringify(history));
  }, [history]);

  const fetchPrice = async (auto = false) => {
    if (!symbol.trim()) return;
    if (!auto) setLoading(true);
    setError(null);

    try {
      const priceData = await getPrice(symbol.toUpperCase());
      if (priceData) {
        setData(priceData);

        if (lastPrice !== null) {
          if (priceData.price > lastPrice) setPriceChange("up");
          else if (priceData.price < lastPrice) setPriceChange("down");
          else setPriceChange(null);
        }
        setLastPrice(priceData.price);

        const newEntry = {
          ...priceData,
          fetchedAt: new Date().toLocaleString("en-US", { hour12: true }),
        };

        setHistory((prev) => [newEntry, ...prev.slice(0, 9)]);
      }
    } catch (err) {
      setError("Failed to fetch market data. Please check backend logs or connection.");
    } finally {
      if (!auto) setLoading(false);
    }
  };

  useEffect(() => {
    let interval;
    if (live && symbol) {
      interval = setInterval(() => fetchPrice(true), 30000);
    }
    return () => clearInterval(interval);
  }, [live, symbol]);

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("marketHistory");
  };

  const filteredHistory = history.filter((h) =>
    h.symbol.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 fixed h-full z-40">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-64 flex flex-col overflow-y-auto">
        <Navbar />

        {/* 🎨 Header Banner */}
        <div
          className="relative h-56 w-full bg-cover bg-center shadow-md"
          style={{ backgroundImage: `url(${bannerImage})` }}
        >
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-white text-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-extrabold tracking-wide"
            >
              🌎 Live Market Data Center
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm md:text-base mt-2 text-gray-200"
            >
              Real-time insights and analytics from global stock exchanges
            </motion.p>
          </div>
        </div>

        <main className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 flex-1 min-h-screen">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2"
          >
            📊 Market Data Dashboard
            {live && (
              <span className="text-green-600 text-sm font-semibold animate-pulse">
                🔴 LIVE MODE
              </span>
            )}
          </motion.h2>

          {/* 🔍 Search & Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <input
              type="text"
              placeholder="Enter Symbol (e.g., AAPL)"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              className="border border-gray-300 p-2 rounded w-48 focus:outline-none focus:ring focus:ring-blue-200 shadow-sm"
            />
            <button
              onClick={() => fetchPrice(false)}
              disabled={loading}
              className={`px-4 py-2 rounded text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 shadow"
              }`}
            >
              {loading ? "Fetching..." : "Get Price"}
            </button>

            {data && (
              <button
                onClick={() => setLive((prev) => !prev)}
                className={`px-4 py-2 rounded text-white font-semibold transition ${
                  live
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                } shadow`}
              >
                {live ? "🛑 Stop Live" : "🔁 Start Live"}
              </button>
            )}

            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-gray-500 text-white rounded font-semibold hover:bg-gray-600 shadow"
            >
              🧹 Clear History
            </button>
          </div>

          {/* ⚠️ Error Message */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 font-medium mb-4"
            >
              ❌ {error}
            </motion.p>
          )}

          {/* 💵 Current Price Card */}
          <AnimatePresence>
            {data && (
              <motion.div
                key={data.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className={`transition border border-gray-200 bg-white rounded-2xl p-6 shadow-md max-w-lg mb-8 transform duration-300 ${
                  priceChange === "up"
                    ? "ring-2 ring-green-400 scale-[1.01]"
                    : priceChange === "down"
                    ? "ring-2 ring-red-400 scale-[1.01]"
                    : ""
                }`}
              >
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  {data.symbol}
                  {priceChange === "up" && (
                    <span className="text-green-600 text-lg">▲</span>
                  )}
                  {priceChange === "down" && (
                    <span className="text-red-600 text-lg">▼</span>
                  )}
                </h3>
                <p className="text-3xl text-blue-700 font-bold">
                  💵 ${data.price?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  ⏱ Updated:{" "}
                  {new Date(data.timestamp).toLocaleString("en-US", {
                    hour12: true,
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1 italic">
                  Total fetches: {history.length}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 📈 Mini Line Chart */}
          {filteredHistory.length > 1 && (
            <div className="bg-white p-4 rounded-xl shadow-md mb-8">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                📈 Recent Price Trend
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={[...filteredHistory].reverse()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fetchedAt" hide />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* 🔍 Filter and History Table */}
          {history.length > 0 && (
            <div className="mb-4 flex justify-between items-center flex-wrap">
              <h3 className="text-lg font-semibold text-gray-700">
                📜 Price History
              </h3>
              <input
                type="text"
                placeholder="🔍 Filter symbol..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 p-2 rounded w-48 focus:outline-none focus:ring focus:ring-blue-200 text-sm"
              />
            </div>
          )}

          {filteredHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200"
            >
              <table className="min-w-full">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                      Symbol
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                      Price ($)
                    </th>
                    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
                      Fetched At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-blue-50 transition`}
                    >
                      <td className="px-4 py-2 font-medium">{item.symbol}</td>
                      <td
                        className={`px-4 py-2 font-semibold ${
                          item.price > (filteredHistory[idx + 1]?.price || 0)
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {item.price?.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-gray-600 text-sm">
                        {item.fetchedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {!data && !error && !loading && history.length === 0 && (
            <p className="text-gray-500 italic text-center mt-10">
              Enter a stock symbol and click <b>"Get Price"</b> to fetch live data.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
