import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import {
  Shield,
  TrendingUp,
  Activity,
  Clock,
  Wifi,
  Bell,
  Database,
  XCircle,
  Zap,
  Terminal,
} from "lucide-react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend,
} from "recharts";
import { getRiskReport, getRiskHistory } from "../api/analyticsApi";

const WEBSOCKET_URL = "ws://localhost:8080/analytics/stream";

export default function Insights() {
  const [risk, setRisk] = useState(null);
  const [history, setHistory] = useState([]);
  const [feed, setFeed] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [live, setLive] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [showFeed, setShowFeed] = useState(false);

  const socketRef = useRef(null);
  const pollRef = useRef(null);

  const addToFeed = (msg) =>
    setFeed((f) => [{ id: Date.now(), text: msg }, ...f.slice(0, 15)]);

  const addAlert = (msg) => {
    const newAlert = { id: Date.now(), text: msg };
    setAlerts((a) => [newAlert, ...a.slice(0, 9)]);
    gsap.fromTo(
      `#alert-${newAlert.id}`,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 0.4 }
    );
  };

  const fetchRisk = async () => {
    try {
      const data = await getRiskReport(1);
      setRisk(data);
      setConnectionStatus("Polling via API");
      addToFeed(`🟢 Risk update (API): Exposure $${data.totalExposure}`);
      setHistory((prev) => [
        ...prev.slice(-49),
        {
          date: new Date(data.lastUpdated).toLocaleTimeString(),
          exposure: data.totalExposure,
        },
      ]);
    } catch (err) {
      addAlert("❌ API call failed");
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await getRiskHistory(1);
      setHistory(data || []);
    } catch (err) {
      console.error("History fetch failed:", err);
    }
  };

  const startPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    addToFeed("🔁 Switched to fallback: API polling every 5s");
    setConnectionStatus("API Fallback");
    pollRef.current = setInterval(fetchRisk, 5000);
  };

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
      addToFeed("🛑 Stopped API polling");
    }
  };

  useEffect(() => {
    if (!live) {
      stopPolling();
      socketRef.current?.close();
      setConnectionStatus("Stopped");
      return;
    }

    let socket;
    try {
      socket = new WebSocket(WEBSOCKET_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        addToFeed("✅ Connected to Live Analytics Stream (Gateway)");
        stopPolling();
        setConnectionStatus("🟢 WebSocket Live");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setRisk(data);
          setConnectionStatus("🟢 WebSocket Live");
          addToFeed(`📡 Live Update: Exposure $${data.totalExposure}`);
        } catch {
          addToFeed(`🔔 ${event.data}`);
        }
      };

      socket.onerror = () => {
        addAlert("⚠️ WebSocket failed — switching to fallback");
        setConnectionStatus("🔴 Socket Error");
        startPolling();
      };

      socket.onclose = () => {
        addAlert("🔴 Socket disconnected — fallback enabled");
        setConnectionStatus("🔴 Disconnected");
        startPolling();
      };
    } catch (err) {
      console.error("WebSocket setup failed:", err);
      addAlert("❌ WebSocket initialization error");
      startPolling();
    }

    return () => {
      socket?.close();
      stopPolling();
    };
  }, [live]);

  useEffect(() => {
    if (connectionStatus === "API Fallback" && socketRef.current?.readyState === 1) {
      addToFeed("⚡ Reconnected via WebSocket — stopping API polling");
      addAlert("⚡ WebSocket reconnected");
      stopPolling();
      setConnectionStatus("🟢 WebSocket Live");
    }
  }, [connectionStatus]);

  useEffect(() => {
    fetchRisk();
    fetchHistory();
    gsap.fromTo(
      ".risk-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.2, duration: 0.8 }
    );
  }, []);

  const gaugeData = [
    {
      name: "Exposure Level",
      uv: risk ? Math.min((risk.totalExposure / 100000) * 100, 100) : 0,
      fill: "#2563eb",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 overflow-hidden">
      {/* Sidebar fixed */}
      <div className="fixed top-0 left-0 h-screen z-40">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 ml-[250px] overflow-auto relative z-30">
        <div className="sticky top-0 z-50">
          <Navbar />
        </div>

        {/* Content area */}
        <div className="p-6">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"
          >
            <Shield className="text-blue-600" /> Analytics & Risk Insights
          </motion.h2>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <button
              onClick={() => setLive((p) => !p)}
              className={`px-4 py-2 rounded-lg text-white font-semibold shadow flex items-center gap-2 ${
                live
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              <Wifi size={18} />
              {live ? "Stop Live Stream" : "Start Live Stream"}
            </button>

            <button
              onClick={() => setShowNotifications((s) => !s)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-semibold shadow flex items-center gap-2 hover:bg-yellow-600"
            >
              <Bell /> {showNotifications ? "Hide Alerts" : "Show Alerts"}
            </button>

            <button
              onClick={() => setShowFeed((s) => !s)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold shadow flex items-center gap-2 hover:bg-blue-600"
            >
              <Terminal /> {showFeed ? "Hide Feed" : "Show Feed"}
            </button>

            <span
              className={`px-3 py-1 rounded-lg text-sm font-semibold shadow ${
                connectionStatus.includes("🟢")
                  ? "bg-green-200 text-green-800"
                  : connectionStatus.includes("🔴")
                  ? "bg-red-200 text-red-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {connectionStatus}
            </span>
          </div>

          {/* Risk cards */}
          {risk && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <RiskCard
                title="Total Exposure"
                value={`$${risk.totalExposure?.toFixed(2)}`}
                icon={<TrendingUp />}
                color="from-blue-500 to-blue-700"
              />
              <RiskCard
                title="Tracked Assets"
                value={Object.keys(risk.positions || {}).length}
                icon={<Activity />}
                color="from-green-500 to-green-700"
              />
              <RiskCard
                title="Last Updated"
                value={new Date(risk.lastUpdated).toLocaleTimeString()}
                icon={<Clock />}
                color="from-yellow-500 to-yellow-700"
              />
            </div>
          )}

          {/* Charts */}
          {history.length > 1 && (
            <div className="grid lg:grid-cols-2 gap-6 mt-10">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-5 rounded-xl shadow-lg"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Database className="text-blue-600" /> 7-Day Risk Exposure Trend
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={history}>
                    <defs>
                      <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Area
                      type="monotone"
                      dataKey="exposure"
                      stroke="#2563eb"
                      fillOpacity={1}
                      fill="url(#colorExp)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white p-5 rounded-xl shadow-lg flex flex-col items-center justify-center"
              >
                <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Zap className="text-green-600" /> Exposure Performance Gauge
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="60%"
                    outerRadius="90%"
                    barSize={25}
                    data={gaugeData}
                  >
                    <RadialBar minAngle={15} background clockWise dataKey="uv" />
                    <Legend
                      iconSize={10}
                      layout="vertical"
                      verticalAlign="middle"
                      align="right"
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <p className="text-sm mt-2 text-gray-600">
                  {gaugeData[0].uv.toFixed(1)}% of safe exposure limit
                </p>
              </motion.div>
            </div>
          )}

          {/* Feed */}
          {showFeed && (
            <div className="mt-10 bg-white p-4 rounded-xl shadow-md">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Terminal className="text-blue-500" /> Live Event Feed
              </h3>
              <div className="max-h-60 overflow-y-auto text-sm text-gray-700 space-y-1">
                {feed.map((f) => (
                  <div key={f.id}>• {f.text}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RiskCard({ title, value, icon, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`risk-card bg-gradient-to-br ${color} text-white p-5 rounded-2xl shadow-lg flex flex-col justify-between transition-all duration-300`}
    >
      <div className="flex items-center gap-3 text-lg font-semibold">
        {icon} {title}
      </div>
      <p className="text-3xl font-bold mt-3">{value}</p>
    </motion.div>
  );
}
