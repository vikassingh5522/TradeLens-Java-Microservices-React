import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Account from "./pages/Account";   // ✅ combined signup + login page
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import MarketData from "./pages/MarketData";
import Insights from "./pages/Insights";

export default function App() {
  const { token } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        {!token ? (
          // 🔒 If not logged in → show Account page only
          <>
            <Route path="/" element={<Account />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          // 🔓 If logged in → allow access to all app pages
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/marketdata" element={<MarketData />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}
