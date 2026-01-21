// import { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import SignIn from "./SignIn";
// import SignUp from "./SignUp";

// export default function AuthPage() {
//   const [mode, setMode] = useState("signin");

//   return (
//     <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

//       {/* LEFT — BRAND PANEL */}
// <div className="hidden md:flex flex-col justify-between 
//     bg-gradient-to-br from-blue-600 to-indigo-700 
//     text-white p-12 relative overflow-hidden">

//   {/* Glow circles */}
//   <motion.div
//     className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl"
//     animate={{ scale: [1, 1.2, 1], rotate: [0, 15, 0] }}
//     transition={{ duration: 6, repeat: Infinity }}
//   />

//   <motion.div
//     className="absolute -bottom-40 -right-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-2xl"
//     animate={{ scale: [1, 1.15, 1], rotate: [0, -15, 0] }}
//     transition={{ duration: 5, repeat: Infinity }}
//   />

//   {/* Top text */}
//   <div className="relative z-10">
//     <h1 className="text-4xl font-bold tracking-wide">AuthSphere</h1>
//     <p className="mt-4 text-lg text-blue-100 max-w-sm leading-relaxed">
//       Secure authentication and role-based access for modern applications.
//     </p>
//   </div>

//   {/* Floating Illustration */}
//   <motion.div
//     className="relative z-10 flex justify-center"
//     animate={{ y: [0, -12, 0], rotate: [0, 2, 0] }}
//     transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
//   >
//     <img
//       src="/auth-illustration.png"
//       alt="AuthSphere Illustration"
//       className="w-[420px] drop-shadow-2xl"
//     />
//   </motion.div>

//   {/* Footer */}
//   <p className="relative z-10 text-sm text-blue-200">
//     © 2026 AuthSphere. All rights reserved.
//   </p>
// </div>

//       {/* RIGHT — FORM PANEL */}
//       <div className="flex items-center justify-center bg-gray-100 px-6">
//         <div className="w-full max-w-md relative">

//           <AnimatePresence mode="wait">
//             {mode === "signin" ? (
//               <motion.div
//                 key="signin"
//                 initial={{ x: 80, opacity: 0, scale: 0.95 }}
//                 animate={{ x: 0, opacity: 1, scale: 1 }}
//                 exit={{ x: -80, opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.5, ease: "easeInOut" }}
//               >
//                 <SignIn switchToSignUp={() => setMode("signup")} />
//               </motion.div>
//             ) : (
//               <motion.div
//                 key="signup"
//                 initial={{ x: 80, opacity: 0, scale: 0.95 }}
//                 animate={{ x: 0, opacity: 1, scale: 1 }}
//                 exit={{ x: -80, opacity: 0, scale: 0.95 }}
//                 transition={{ duration: 0.5, ease: "easeInOut" }}
//               >
//                 <SignUp switchToSignIn={() => setMode("signin")} />
//               </motion.div>
//             )}
//           </AnimatePresence>

//         </div>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignIn from "./SignIn";
import SignUp from "./SignUp";

export default function AuthPage() {
  const [mode, setMode] = useState("signin");

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT — BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between 
        bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 
        text-white p-16 relative overflow-hidden">

        {/* Animated background blobs */}
        <motion.div
          className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -25, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/25 rounded-full blur-2xl"
          animate={{ scale: [1, 1.15, 1], rotate: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Floating dots */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/30 rounded-full"
            style={{ left: `${20 + i * 15}%`, top: `${30 + i * 10}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Brand header */}
        <motion.div
          className="relative z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <div className="w-6 h-6 bg-white rounded-lg" />
            </div>
            <h1 className="text-5xl font-bold tracking-tight">AuthSphere</h1>
          </div>

          <p className="text-xl text-violet-100 max-w-md leading-relaxed">
            Secure authentication and role-based access for modern applications.
          </p>
        </motion.div>

        {/* Illustration */}
        <motion.div
          className="relative z-10 flex justify-center items-center py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative">
            {/* Animated security shield */}
            <motion.div
              className="relative w-64 h-64 mx-auto"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-white/20"
                animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              {/* Middle ring */}
              <motion.div
                className="absolute inset-8 rounded-full border-4 border-white/30"
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              
              {/* Inner glow */}
              <motion.div
                className="absolute inset-16 rounded-full bg-gradient-to-br from-white/40 to-violet-300/40 backdrop-blur-xl flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                {/* Lock icon */}
                <svg
                  className="w-16 h-16 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </motion.div>

              {/* Floating particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-white/50 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transformOrigin: '0 0',
                  }}
                  animate={{
                    rotate: [i * 45, i * 45 + 360],
                    x: [0, Math.cos((i * 45 * Math.PI) / 180) * 140],
                    y: [0, Math.sin((i * 45 * Math.PI) / 180) * 140],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </motion.div>

            {/* Feature badges */}
            <div className="mt-12 grid grid-cols-3 gap-4">
              {[
                { icon: '🔐', text: 'Secure' },
                { icon: '⚡', text: 'Fast' },
                { icon: '🎯', text: 'Reliable' }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <div className="text-sm font-semibold text-white/90">{item.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="relative z-10 flex justify-between text-sm text-violet-200">
          <p>© 2026 AuthSphere. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
          </div>
        </div>
      </div>

      {/* RIGHT — FORM PANEL */}
      <div className="flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6 py-12 relative overflow-hidden">

        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, black 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {mode === "signin" ? (
              <motion.div
                key="signin"
                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <SignIn switchToSignUp={() => setMode("signup")} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ x: 100, opacity: 0, scale: 0.9 }}
                animate={{ x: 0, opacity: 1, scale: 1 }}
                exit={{ x: -100, opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              >
                <SignUp switchToSignIn={() => setMode("signin")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
