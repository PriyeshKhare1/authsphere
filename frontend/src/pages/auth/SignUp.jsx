



import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Check } from "lucide-react";
import { registerUser } from "../../api/auth.api";

export default function SignUp({ switchToSignIn }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // default role (user or manager allowed, admin is hidden)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 🔐 Password strength calculation
  const passwordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.password);
  const strengthColors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
  const strengthLabels = ["Weak", "Fair", "Good", "Strong"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  // 🚀 REGISTER
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await registerUser({
        name: formData.fullName, // backend expects "name"
        email: formData.email,
        password: formData.password,
        role: formData.role, // send role (user or manager only)
      });

      // ✅ Auto login if token exists
      if (res.token && res.user) {
        localStorage.setItem(
          "auth_user",
          JSON.stringify({
            token: res.token,
            user: res.user,
          })
        );
        // After registering and storing token, go to dashboard
        window.location.href = "/dashboard";
      } else {
        const targetEmail = formData.email;
        setSuccess(`Verification email sent to ${targetEmail}. Please check your inbox.`);
        // Keep on the page but offer switch to sign-in
        setTimeout(() => switchToSignIn(), 1200);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Signup failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_70px_rgba(139,92,246,0.15)]
                 p-12 border border-white/60 relative overflow-hidden"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      {/* Decorative Orbs */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-violet-400/20 to-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-gradient-to-tr from-indigo-400/20 to-blue-600/20 rounded-full blur-2xl" />

      {/* Header */}
      <div className="mb-10 relative z-10">
        <h2 className="text-[2.75rem] font-extrabold bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          Create account
        </h2>
        <p className="text-gray-500 text-lg">Join AuthSphere and start your journey</p>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-100 text-red-600 rounded-xl font-semibold">{error}</div>
      )}

      {success && (
        <div className="mb-6 p-3 bg-green-100 text-green-700 rounded-xl font-semibold">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {/* Full Name */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              required
              placeholder="John Doe"
              className="w-full pl-12 py-4 border-2 rounded-2xl"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Email address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full pl-12 py-4 border-2 rounded-2xl"
            />
          </div>
        </div>

        {/* Role Selection - Admin is hidden for security */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Account Type</label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full px-4 py-4 border-2 rounded-2xl bg-white"
          >
            <option value="user">User (Employee)</option>
            <option value="manager">Manager (Team Lead)</option>
          </select>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
              className="w-full pl-12 pr-12 py-4 border-2 rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* Password Strength */}
          {formData.password && (
            <div className="mt-3">
              <div className="flex gap-1 mb-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < strength ? strengthColors[strength - 1] : "bg-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs font-semibold">
                Strength: {strengthLabels[strength - 1] || "Weak"}
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
            placeholder="Confirm Password"
            className="w-full pl-12 pr-12 py-4 border-2 rounded-2xl"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>

          {formData.password === formData.confirmPassword && formData.confirmPassword && (
            <Check className="absolute right-12 top-1/2 -translate-y-1/2 text-green-500" />
          )}
        </div>

        {/* Submit */}
        <button
          disabled={loading || strength < 2}
          className="w-full py-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold rounded-2xl shadow-xl"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {/* Sign in link */}
      <p className="text-sm text-center text-gray-600 mt-10">
        Already have an account?{" "}
        <button onClick={switchToSignIn} className="font-bold text-violet-600">
          Sign in
        </button>
      </p>
    </motion.div>
  );
}
