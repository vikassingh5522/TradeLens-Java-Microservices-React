// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

// // Pages
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Transactions from "./pages/Transactions";
// import MarketData from "./pages/MarketData";
// import Insights from "./pages/Insights";

// function PrivateRoute({ children }) {
//   const { token } = useAuth();
//   return token ? children : <Navigate to="/" replace />;
// }

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />} />
//       <Route path="/signup" element={<Signup />} />

//       <Route
//         path="/dashboard"
//         element={<PrivateRoute><Dashboard /></PrivateRoute>}
//       />
//       <Route
//         path="/transactions"
//         element={<PrivateRoute><Transactions /></PrivateRoute>}
//       />
//       <Route
//         path="/market"
//         element={<PrivateRoute><MarketData /></PrivateRoute>}
//       />
//       <Route
//         path="/insights"
//         element={<PrivateRoute><Insights /></PrivateRoute>}
//       />

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }
