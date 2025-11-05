import { useState, useEffect, useContext } from "react";
import { addTransaction, getHoldings } from "../api/portfolioApi";
// import { getLivePrice } from "../api/marketApi";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

export default function Transactions() {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    symbol: "",
    quantity: "",
    price: "",
    type: "BUY",
  });
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchHoldings = async () => {
    try {
      const res = await getHoldings(token);
      const data = res.data || [];

      // Fetch live market prices for each symbol
      const updated = await Promise.all(
        data.map(async (h) => {
          try {
            // const livePrice = await getLivePrice(h.symbol);
            const livePrice = h.avgPrice; // fallback example
            const currentPrice = livePrice || h.avgPrice;
            const totalVal = currentPrice * h.quantity;
            const profit = (currentPrice - h.avgPrice) * h.quantity;
            return { ...h, currentPrice, totalVal, profit };
          } catch {
            return { ...h, currentPrice: h.avgPrice, totalVal: h.avgPrice * h.quantity, profit: 0 };
          }
        })
      );

      setHoldings(updated);
      setTotalValue(updated.reduce((sum, h) => sum + h.totalVal, 0));
      setTotalProfit(updated.reduce((sum, h) => sum + h.profit, 0));
    } catch (err) {
      console.error("❌ Error fetching holdings:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:8080/portfolio/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = (res.data || []).sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      setTransactions(sorted);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
    }
  };

  useEffect(() => {
    fetchHoldings();
    fetchTransactions();
  }, []);

  const handleAdd = async () => {
    if (!form.symbol || !form.quantity || !form.price) {
      toast.error("⚠️ Please fill in all fields before submitting.");
      return;
    }

    setLoading(true);
    try {
      await addTransaction(form, token);

      if (form.type === "BUY") {
        toast.success(`✅ Buy transaction added successfully! (${form.symbol})`);
      } else if (form.type === "SELL") {
        toast.info(`📉 Sell transaction recorded successfully! (${form.symbol})`);
      }

      await Promise.all([fetchHoldings(), fetchTransactions()]);
      setForm({ symbol: "", quantity: "", price: "", type: "BUY" });
    } catch (err) {
      console.error("❌ Error adding transaction:", err);
      toast.error("❌ Error adding transaction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar Fixed */}
      <div className="w-64 fixed h-screen bg-white shadow-md z-20">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 overflow-y-auto h-screen">
        <Navbar />
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            📊 Portfolio Dashboard (Live Data)
          </h2>

          {/* Summary Cards */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 flex-1 min-w-[250px] shadow-sm">
              <h3 className="text-lg font-semibold text-blue-700">💰 Total Value</h3>
              <p className="text-2xl font-bold text-blue-800 mt-1">
                ${totalValue.toFixed(2)}
              </p>
            </div>

            <div className="bg-green-100 border border-green-400 rounded-lg p-4 flex-1 min-w-[250px] shadow-sm">
              <h3 className="text-lg font-semibold text-green-700">📈 Profit / Loss</h3>
              <p
                className={`text-2xl font-bold mt-1 ${
                  totalProfit >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {totalProfit >= 0 ? "+" : "-"}${Math.abs(totalProfit).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Add Transaction Form */}
          <h3 className="text-xl font-semibold mb-4">Add Transaction</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            <input
              className="border p-2 rounded w-40 sm:w-44"
              placeholder="Symbol (e.g. AAPL)"
              value={form.symbol}
              onChange={(e) =>
                setForm({ ...form, symbol: e.target.value.toUpperCase() })
              }
            />
            <input
              className="border p-2 rounded w-28"
              type="number"
              placeholder="Quantity"
              value={form.quantity}
              onChange={(e) =>
                setForm({ ...form, quantity: Number(e.target.value) })
              }
            />
            <input
              className="border p-2 rounded w-28"
              type="number"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
            <select
              className="border p-2 rounded w-24"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
            </select>

            <button
              className={`px-4 py-2 rounded text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={handleAdd}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Transaction"}
            </button>
          </div>

          {/* Holdings Table */}
          <h3 className="text-lg font-semibold mb-2">💼 Your Holdings</h3>
          {holdings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm mb-8 shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Symbol</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Avg Price</th>
                    <th className="p-2 border">Live Price</th>
                    <th className="p-2 border">Total Value</th>
                    <th className="p-2 border">Profit / Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="p-2 border font-medium">{h.symbol}</td>
                      <td className="p-2 border">{h.quantity}</td>
                      <td className="p-2 border">${h.avgPrice.toFixed(2)}</td>
                      <td className="p-2 border">
                        ${h.currentPrice?.toFixed(2) || "-"}
                      </td>
                      <td className="p-2 border">${h.totalVal?.toFixed(2)}</td>
                      <td
                        className={`p-2 border font-semibold ${
                          h.profit >= 0 ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {h.profit >= 0 ? "+" : "-"}${Math.abs(h.profit).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic mb-8">No holdings yet.</p>
          )}

          {/* Transaction History */}
          <h3 className="text-lg font-semibold mb-2">📜 Transaction History</h3>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Symbol</th>
                    <th className="p-2 border">Type</th>
                    <th className="p-2 border">Quantity</th>
                    <th className="p-2 border">Price</th>
                    <th className="p-2 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, idx) => (
                    <tr key={idx} className="text-center">
                      <td className="p-2 border">
                        {new Date(t.timestamp).toLocaleString()}
                      </td>
                      <td className="p-2 border font-medium">{t.symbol}</td>
                      <td
                        className={`p-2 border font-semibold ${
                          t.type === "BUY" ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {t.type}
                      </td>
                      <td className="p-2 border">{t.quantity}</td>
                      <td className="p-2 border">${t.price.toFixed(2)}</td>
                      <td className="p-2 border">
                        ${(t.price * t.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No transactions yet.</p>
          )}
        </div>
        <ToastContainer position="top-right" autoClose={2500} />
      </div>
    </div>
  );
}
