import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  BarChart3,
  Menu,
  X,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // 🌀 GSAP entrance animation for desktop links
  useEffect(() => {
    gsap.fromTo(
      ".sidebar-link",
      { x: -40, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".sidebar",
          start: "top bottom",
        },
      }
    );
  }, []);

  // 🪄 Lock body scroll when mobile sidebar is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  // Toggle sidebar visibility
  const toggleSidebar = () => setOpen((prev) => !prev);

  return (
    <>
      {/* ---------- Mobile Toggle Button ---------- */}
      <div className="md:hidden fixed top-3 left-3 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-2 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ---------- Overlay (for mobile) ---------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* ---------- Sidebar ---------- */}
      <AnimatePresence>
        {(open || window.innerWidth >= 768) && (
          <motion.aside
            key="sidebar"
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -250, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className={`sidebar fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-blue-700 via-indigo-700 to-purple-700 text-white flex flex-col justify-between shadow-xl z-50 md:translate-x-0`}
          >
            {/* ---------- Menu Section ---------- */}
            <div className="p-5 space-y-4">
              <h2 className="text-2xl font-extrabold tracking-tight mb-6 flex items-center justify-between">
                <span>
                  <span className="text-yellow-300">T</span>radeLens
                </span>
                {/* Close button (visible only on mobile) */}
                <button
                  onClick={toggleSidebar}
                  className="md:hidden bg-white/10 hover:bg-white/20 p-1 rounded-lg"
                >
                  <X size={20} />
                </button>
              </h2>

              <nav className="flex flex-col space-y-3">
                <SidebarLink
                  to="/dashboard"
                  icon={<LayoutDashboard size={20} />}
                  label="Dashboard"
                  active={location.pathname === "/dashboard"}
                  onClick={toggleSidebar}
                />
                <SidebarLink
                  to="/transactions"
                  icon={<Briefcase size={20} />}
                  label="Transactions"
                  active={location.pathname === "/transactions"}
                  onClick={toggleSidebar}
                />
                <SidebarLink
                  to="/marketdata"
                  icon={<TrendingUp size={20} />}
                  label="Market Data"
                  active={location.pathname === "/marketdata"}
                  onClick={toggleSidebar}
                />
                <SidebarLink
                  to="/insights"
                  icon={<BarChart3 size={20} />}
                  label="Insights"
                  active={location.pathname === "/insights"}
                  onClick={toggleSidebar}
                />
              </nav>
            </div>

            {/* ---------- Footer ---------- */}
            <div className="p-5 border-t border-white/20 text-sm text-white/80">
              <p>📅 {new Date().toLocaleDateString()}</p>
              <p className="mt-1">🌐 v2.5 Dashboard</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------- Sidebar Link Component ----------
function SidebarLink({ to, icon, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`sidebar-link flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ease-in-out ${
        active
          ? "bg-white text-blue-700 font-semibold shadow-md"
          : "hover:bg-white/20"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm">{label}</span>
    </Link>
  );
}
