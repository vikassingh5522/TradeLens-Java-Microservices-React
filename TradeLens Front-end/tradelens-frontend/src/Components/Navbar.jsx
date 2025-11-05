import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const [time, setTime] = useState(new Date());
  const [search, setSearch] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 🕒 Auto-update clock
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      alert(`🔍 Searching for "${search}"...`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white px-4 md:px-6 py-3 shadow-md sticky top-0 z-50">
      {/* Top Row */}
      <div className="flex justify-between items-center">
        {/* ---------- Left Section ---------- */}
        <div className="flex items-center gap-3">
          <h1 className="font-extrabold text-2xl tracking-wide flex items-center">
            📊 Trade<span className="text-yellow-300">Lens</span>
          </h1>
          <span className="hidden sm:block text-sm bg-white/20 px-2 py-1 rounded-lg font-semibold">
            {time.toLocaleTimeString()}
          </span>
        </div>

        {/* ---------- Mobile Menu Toggle ---------- */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 bg-white/20 rounded-full hover:bg-white/30 transition"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* ---------- Right Section (Desktop) ---------- */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/20 rounded-full overflow-hidden px-3 py-1"
          >
            <input
              type="text"
              placeholder="Search stock (AAPL, TSLA...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-white/70 outline-none px-2 w-48 sm:w-64"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-3 py-1 rounded-full ml-2 transition-all"
            >
              Search
            </button>
          </form>

          {/* User Info */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white text-blue-600 flex items-center justify-center font-bold rounded-full shadow">
              U
            </div>
            <span className="hidden sm:block text-sm font-semibold text-white/90">
              Welcome back 👋
            </span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full font-semibold transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* ---------- Mobile Menu Content ---------- */}
      {isMenuOpen && (
        <div className="flex flex-col mt-4 gap-3 md:hidden animate-slide-down">
          {/* Search */}
          <form
            onSubmit={handleSearch}
            className="flex items-center bg-white/20 rounded-full overflow-hidden px-3 py-1"
          >
            <input
              type="text"
              placeholder="Search stock (AAPL, TSLA...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-white placeholder-white/70 outline-none px-2 w-full"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold px-3 py-1 rounded-full ml-2 transition-all text-sm"
            >
              Search
            </button>
          </form>

          {/* User Info */}
          <div className="flex items-center justify-between bg-white/10 p-2 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white text-blue-600 flex items-center justify-center font-bold rounded-full shadow">
                U
              </div>
              <span className="text-sm font-semibold text-white/90">
                Welcome back 👋
              </span>
            </div>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 px-4 py-1 rounded-full font-semibold transition-all text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
