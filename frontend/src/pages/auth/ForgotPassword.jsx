// import { useState } from "react";
// import { Link } from "react-router-dom";
// import Input from "../../ui/Input";
// import Button from "../../ui/Button";

// export default function ForgotPassword() {
//   const [sent, setSent] = useState(false);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-12 rounded-3xl shadow-2xl max-w-md w-full text-center">

//         {!sent ? (
//           <>
//             <h2 className="text-2xl font-bold mb-3">Forgot password?</h2>
//             <p className="text-gray-500 mb-6">
//               Enter your email to reset your password.
//             </p>

//             <Input
//               label="Email"
//               type="email"
//               className="focus:ring-2 focus:ring-blue-400"
//             />

//             <Button
//               className="mt-4 w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
//               onClick={() => setSent(true)}
//             >
//               Send reset link
//             </Button>
//           </>
//         ) : (
//           <>
//             <h2 className="text-2xl font-bold mb-3">Email sent 📩</h2>
//             <p className="text-gray-500 mb-6">
//               Please check your inbox.
//             </p>

//             <Button
//               className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
//               onClick={() => setSent(false)}
//             >
//               Send Again
//             </Button>
//           </>
//         )}

//         <Link
//           to="/"
//           className="text-blue-600 text-sm hover:underline block mt-6"
//         >
//           Back to sign in
//         </Link>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  const handleResend = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12 relative overflow-hidden">

      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glow blobs */}
      <motion.div
        className="absolute top-20 left-20 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Card */}
      <motion.div
        className="bg-white/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-md w-full relative z-10 border border-gray-200/50"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Icon */}
              <motion.div
                className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-500/30"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <Mail className="text-white" size={28} />
              </motion.div>

              <h2 className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Forgot password?
              </h2>

              <p className="text-gray-500 text-center mb-8">
                Enter your email and we’ll send reset instructions.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <motion.input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl bg-white/50 focus:border-violet-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={!email || loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg shadow-violet-500/30 hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send reset link
                      </>
                    )}
                  </span>
                </motion.button>
              </form>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-violet-600 text-sm font-medium mt-6 hover:text-violet-700"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle2 className="text-white" size={40} />
              </motion.div>

              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
                Check your email
              </h2>

              <p className="text-gray-500 mb-1">
                We’ve sent reset instructions to
              </p>
              <p className="text-violet-600 font-semibold mb-8">{email}</p>

              <motion.button
                onClick={handleResend}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-4 rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl transition disabled:opacity-50"
              >
                {loading ? "Sending..." : "Resend email"}
              </motion.button>

              <Link
                to="/"
                className="flex items-center justify-center gap-2 text-violet-600 text-sm font-medium mt-6 hover:text-violet-700"
              >
                <ArrowLeft size={16} />
                Back to sign in
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
