import { useState, useContext, useEffect, useRef } from "react";
import { signup, login as loginApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";

export default function Account() {
  const [step, setStep] = useState("signup"); // "signup" → "login"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const cardRef = useRef(null);

  // 🌀 Subtle floating tilt animation
  useEffect(() => {
    const el = cardRef.current;
    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateY = ((x - rect.width / 2) / rect.width) * 15;
      const rotateX = ((rect.height / 2 - y) / rect.height) * 15;
      gsap.to(el, { rotationY: rotateY, rotationX: rotateX, duration: 0.3 });
    };
    const resetTilt = () => gsap.to(el, { rotationY: 0, rotationX: 0, duration: 0.5 });
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", resetTilt);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", resetTilt);
    };
  }, []);

  const handleSignup = async () => {
    try {
      await signup(form);
      gsap.fromTo(
        cardRef.current,
        { scale: 1 },
        { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2, ease: "back.out(2)" }
      );
      alert("✅ User registered successfully! Please login now.");
      setStep("login");
    } catch (err) {
      gsap.to(cardRef.current, { x: -10, repeat: 3, yoyo: true, duration: 0.1 });
      alert("❌ Signup failed. Try again.");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await loginApi({ email: form.email, password: form.password });
      login(res.data.token);
      gsap.fromTo(
        cardRef.current,
        { scale: 1 },
        { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2, ease: "back.out(2)" }
      );
      navigate("/dashboard");
    } catch (err) {
      gsap.to(cardRef.current, { x: -10, repeat: 3, yoyo: true, duration: 0.1 });
      alert("❌ Invalid credentials. Try again.");
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* 🌈 Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 animate-gradient bg-[length:200%_200%]" />

      <style>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient { animation: gradient 6s ease infinite; }
      `}</style>

      {/* 🌌 Floating animated icons / particles */}
      {["💫", "🔐", "📈", "⚡", "✨"].map((icon, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl opacity-60"
          style={{
            left: `${10 + i * 15}%`,
            top: `${20 + i * 10}%`,
          }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.6, 1, 0.6],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {icon}
        </motion.div>
      ))}

      {/* 🪩 Floating Glass Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-8 w-96 border border-white/30 relative overflow-hidden"
      >
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

        {/* 🔄 Animated Form Switch */}
        <AnimatePresence mode="wait">
          {step === "signup" ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                ✨ Sign Up
              </h2>
              <input
                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all p-2 mb-3 w-full rounded-md"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all p-2 mb-3 w-full rounded-md"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all p-2 mb-4 w-full rounded-md"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white py-2 w-full rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
                onClick={handleSignup}
              >
                Sign Up
              </motion.button>
              <p className="text-sm text-center mt-4 text-gray-700">
                Already have an account?{" "}
                <button
                  className="text-blue-600 underline hover:text-blue-800 transition"
                  onClick={() => setStep("login")}
                >
                  Login here
                </button>
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
                🚀 Login
              </h2>
              <input
                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all p-2 mb-3 w-full rounded-md"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <input
                className="border border-gray-300 focus:ring-2 focus:ring-blue-400 transition-all p-2 mb-4 w-full rounded-md"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 w-full rounded-lg font-semibold shadow-lg hover:shadow-xl transition"
                onClick={handleLogin}
              >
                Login
              </motion.button>
              <p className="text-sm text-center mt-4 text-gray-700">
                Don’t have an account?{" "}
                <button
                  className="text-green-600 underline hover:text-green-800 transition"
                  onClick={() => setStep("signup")}
                >
                  Sign up here
                </button>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
