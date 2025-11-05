import { useEffect, useState, useContext } from "react";
import { getHoldings } from "../api/portfolioApi";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../Components/Sidebar";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

export default function Dashboard() {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (token) {
          const res = await getHoldings(token);
          setHoldings(res.data || []);
        }
      } catch (err) {
        console.error("❌ Error fetching holdings:", err.message);
        setError("Failed to load portfolio data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const totalValue = holdings
    .reduce((acc, h) => acc + h.price * h.quantity, 0)
    .toFixed(2);

  const totalStocks = holdings.length;
  const topHolding =
    holdings.length > 0
      ? holdings.reduce((max, h) =>
          h.price * h.quantity > max.price * max.quantity ? h : max
        )
      : null;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* ✅ Sidebar - flush, no gap */}
      <Sidebar />

      {/* ✅ Main Section directly beside sidebar */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen overflow-hidden">
        <Navbar />

        <div className="flex-1 overflow-y-auto p-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
            💼 Portfolio Dashboard
          </h2>

          {loading && (
            <p className="text-gray-500 italic">Loading portfolio data...</p>
          )}
          {error && <p className="text-red-600 font-semibold">❌ {error}</p>}

          {!loading && !error && holdings.length > 0 && (
            <>
              {/* ---------- Summary Cards ---------- */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
                  <h3 className="text-gray-500 text-sm font-semibold">
                    Total Portfolio Value
                  </h3>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    ${totalValue}
                  </p>
                </div>

                <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
                  <h3 className="text-gray-500 text-sm font-semibold">
                    Total Holdings
                  </h3>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {totalStocks}
                  </p>
                </div>

                {topHolding && (
                  <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition">
                    <h3 className="text-gray-500 text-sm font-semibold">
                      Top Performing Stock
                    </h3>
                    <p className="text-xl font-bold text-purple-700 mt-2">
                      {topHolding.symbol}
                    </p>
                    <p className="text-gray-600 text-sm">
                      ${(topHolding.price * topHolding.quantity).toFixed(2)}{" "}
                      value
                    </p>
                  </div>
                )}
              </div>

              {/* ---------- Chart Section ---------- */}
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  📊 Portfolio Distribution
                </h3>
                <div className="flex justify-center">
                  <PieChart width={400} height={300}>
                    <Pie
                      data={holdings}
                      dataKey="quantity"
                      nameKey="symbol"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      label
                    >
                      {holdings.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </div>
              </div>

              {/* ---------- Holdings Table ---------- */}
              <div className="bg-white rounded-2xl shadow-md p-6 overflow-x-auto">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  🧾 Your Holdings
                </h3>
                <table className="min-w-full text-left border border-gray-200 rounded-lg">
                  <thead className="bg-blue-100">
                    <tr>
                      <th className="py-3 px-4 font-semibold text-gray-700">
                        Symbol
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-700">
                        Quantity
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-700">
                        Price ($)
                      </th>
                      <th className="py-3 px-4 font-semibold text-gray-700">
                        Value ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((h, idx) => (
                      <tr
                        key={idx}
                        className={`${
                          idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                        } hover:bg-blue-50 transition`}
                      >
                        <td className="py-3 px-4 font-semibold text-gray-700">
                          {h.symbol}
                        </td>
                        <td className="py-3 px-4 text-gray-600">{h.quantity}</td>
                        <td className="py-3 px-4 text-gray-600">
                          {h.price.toFixed(2)}
                        </td>
                        <td className="py-3 px-4 text-green-600 font-semibold">
                          ${(h.price * h.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {!loading && !error && holdings.length === 0 && (
            <p className="text-gray-500 italic">
              You don’t have any holdings yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
