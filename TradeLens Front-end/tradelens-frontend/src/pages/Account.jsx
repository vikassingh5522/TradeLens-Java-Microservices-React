import { useState, useContext } from "react";
import { signup, login as loginApi } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const [step, setStep] = useState("signup"); // "signup" → "login"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle signup then go to login
  const handleSignup = async () => {
    try {
      await signup(form);
      alert("User registered successfully! Please login now.");
      setStep("login"); // move to login form
    } catch (err) {
      console.error(err);
      alert("Signup failed. Try again.");
    }
  };

  // Handle login then go to dashboard
  const handleLogin = async () => {
    try {
      const res = await loginApi({ email: form.email, password: form.password });
      login(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="bg-white shadow-md rounded-lg p-8 w-96">
        {step === "signup" ? (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
            <input
              className="border p-2 mb-3 w-full rounded"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="border p-2 mb-3 w-full rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="border p-2 mb-4 w-full rounded"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              className="bg-green-600 text-white py-2 w-full rounded hover:bg-green-700"
              onClick={handleSignup}
            >
              Sign Up
            </button>
            <p className="text-sm text-center mt-4">
              Already have an account?{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setStep("login")}
              >
                Login here
              </button>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <input
              className="border p-2 mb-3 w-full rounded"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              className="border p-2 mb-4 w-full rounded"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              className="bg-blue-600 text-white py-2 w-full rounded hover:bg-blue-700"
              onClick={handleLogin}
            >
              Login
            </button>
            <p className="text-sm text-center mt-4">
              Don’t have an account?{" "}
              <button
                className="text-green-600 underline"
                onClick={() => setStep("signup")}
              >
                Sign up here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
