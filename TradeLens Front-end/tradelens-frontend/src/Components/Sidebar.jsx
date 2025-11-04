import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-48 bg-gray-100 p-4 space-y-3 h-screen shadow-md">
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className="hover:text-blue-600">🏠 Dashboard</Link>
        <Link to="/transactions" className="hover:text-blue-600">💼 Transactions</Link>
        <Link to="/marketdata" className="hover:text-blue-600">📈 Market Data</Link>
        <Link to="/insights" className="hover:text-blue-600">📊 Insights</Link>
      </nav>
    </aside>
  );
}
