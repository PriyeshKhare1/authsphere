

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SignIn({ switchToSignUp }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    await login({ email, password });
    navigate("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    const errorMsg = err.message || "Login failed";
    setError(errorMsg);
  } finally {
    setLoading(false);
  }
};


  return (
    <motion.div
      className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-gray-200/50 overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Gradient glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-400 to-purple-400 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-indigo-400 to-blue-400 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10">
        <div className="mb-8">
          <motion.div
            className="inline-block mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-violet-500/30">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </motion.div>

          <motion.h2
            className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome back
          </motion.h2>
          <motion.p
            className="text-gray-500 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Sign in to continue to AuthSphere
          </motion.p>
        </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-700 text-sm font-medium">{error}</p>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email address
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300 ${focusedField === "email" ? "opacity-30" : ""}`} />
            <Mail size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "email" ? "text-violet-600" : "text-gray-400"}`} />
            <motion.input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="you@example.com"
              required
              whileFocus={{ scale: 1.01 }}
              className={`relative w-full pl-12 pr-4 py-4 border-2 rounded-xl bg-white transition-all duration-300 outline-none
                ${focusedField === "email" 
                  ? "border-violet-500 shadow-lg shadow-violet-500/20" 
                  : "border-gray-200 hover:border-gray-300"
                }`}
            />
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300 ${focusedField === "password" ? "opacity-30" : ""}`} />
            <Lock size={20} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "password" ? "text-violet-600" : "text-gray-400"}`} />
            <motion.input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholder="••••••••"
              required
              whileFocus={{ scale: 1.01 }}
              className={`relative w-full pl-12 pr-12 py-4 border-2 rounded-xl bg-white transition-all duration-300 outline-none
                ${focusedField === "password" 
                  ? "border-violet-500 shadow-lg shadow-violet-500/20" 
                  : "border-gray-200 hover:border-gray-300"
                }`}
            />
            <motion.button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === "password" ? "text-violet-600" : "text-gray-400 hover:text-gray-600"}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </motion.button>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={!email || !password || loading}
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          className="relative w-full overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 
            text-white py-4 rounded-xl font-bold shadow-xl shadow-violet-500/40
            hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          />
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </span>
        </motion.button>
      </form>

      {/* Sign up link */}
      <p className="text-sm text-center text-gray-600 mt-8">
        Don’t have an account?{" "}
        <button
          onClick={switchToSignUp}
          className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 transition-all"
        >
          Sign up for free
        </button>
      </p>
      </div>
    </motion.div>
  );
}
