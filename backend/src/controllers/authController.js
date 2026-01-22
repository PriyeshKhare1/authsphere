// import User from "../models/User.js";
// import LoginHistory from "../models/LoginHistory.js";
// import jwt from "jsonwebtoken";
// import { generateVerificationToken, sendVerificationEmail, sendWelcomeEmail } from "../utils/emailService.js";

// const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// export const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     // Validate input
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Please provide name, email, and password" });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) return res.status(400).json({ message: "User already exists" });

//     // Generate email verification token
//     const verificationToken = generateVerificationToken();
//     const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     // Only allow 'user' or 'manager' roles from registration
//     // Admin role can ONLY be created via CLI script (security best practice)
//     const allowedRole = (role === 'manager') ? 'manager' : 'user';

//     // Development mode: Skip email verification for testing
//     const skipEmailVerification = process.env.SKIP_EMAIL_VERIFICATION === 'true';
    
//     // Create user with allowed role
//     const user = await User.create({ 
//       name, 
//       email, 
//       password, 
//       role: allowedRole, // 'user' or 'manager' only - admin is hidden
//       isEmailVerified: skipEmailVerification, // Auto-verify in dev mode
//       emailVerificationToken: skipEmailVerification ? undefined : verificationToken,
//       emailVerificationExpires: skipEmailVerification ? undefined : verificationExpires,
//     });

//     if (user) {
//       // Send verification email only if NOT in skip mode
//       if (!skipEmailVerification) {
//         const emailResult = await sendVerificationEmail(user, verificationToken);
        
//         if (!emailResult.success) {
//           console.error('Failed to send verification email:', emailResult.error);
//         }
//       }

//       // In dev mode with skip, auto-login user
//       if (skipEmailVerification) {
//         const token = generateToken(user._id);
//         res.status(201).json({
//           message: "Registration successful! (Email verification skipped in development mode)",
//           token,
//           user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             isEmailVerified: user.isEmailVerified,
//           },
//         });
//       } else {
//         res.status(201).json({
//           message: "Registration successful! Please check your email to verify your account.",
//           user: {
//             _id: user._id,
//             name: user.name,
//             email: user.email,
//             isEmailVerified: user.isEmailVerified,
//           },
//         });
//       }
//     } else {
//       res.status(400).json({ message: "Invalid user data" });
//     }
//   } catch (error) {
//     console.error("Registration error:", error.message);
//     console.error("Full error:", error);
//     res.status(500).json({ message: error.message || "Server error during registration" });
//   }
// };
// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//       return res.status(400).json({ message: "Please provide email and password" });
//     }

//     const user = await User.findOne({ email });
//     if (!user || !(await user.matchPassword(password))) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     // Check if email is verified (skip in development mode)
//     const skipEmailVerification = process.env.SKIP_EMAIL_VERIFICATION === 'true';
//     if (!skipEmailVerification && !user.isEmailVerified) {
//       return res.status(403).json({ 
//         message: "Please verify your email before logging in. Check your inbox for the verification link.",
//         emailNotVerified: true,
//       });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     // Save login history
//     try {
//       await LoginHistory.create({
//         user: user._id,
//         checkIn: new Date(),
//       });
//     } catch (historyError) {
//       console.error("Failed to save login history:", historyError);
//       // Don't fail the login if history save fails
//     }

//     // Send response
//     res.status(200).json({
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: error.message || "Server error during login" });
//   }
// };

// // Verify email with token
// export const verifyEmail = async (req, res) => {
//   try {
//     const { token } = req.params;

//     // Find user with this verification token
//     const user = await User.findOne({
//       emailVerificationToken: token,
//       emailVerificationExpires: { $gt: Date.now() }, // Token not expired
//     });

//     if (!user) {
//       return res.status(400).json({ 
//         message: "Invalid or expired verification link. Please request a new one.",
//         expired: true,
//       });
//     }

//     // Mark email as verified
//     user.isEmailVerified = true;
//     user.emailVerificationToken = undefined;
//     user.emailVerificationExpires = undefined;
//     await user.save();

//     // Send welcome email
//     await sendWelcomeEmail(user);

//     res.status(200).json({
//       message: "Email verified successfully! You can now log in.",
//       verified: true,
//     });
//   } catch (error) {
//     console.error("Email verification error:", error);
//     res.status(500).json({ message: "Server error during email verification" });
//   }
// };

// // Resend verification email
// export const resendVerificationEmail = async (req, res) => {
//   try {
//     const { email } = req.body;

//     if (!email) {
//       return res.status(400).json({ message: "Please provide your email address" });
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: "No account found with this email" });
//     }

//     if (user.isEmailVerified) {
//       return res.status(400).json({ message: "Email is already verified. You can log in now." });
//     }

//     // Generate new verification token
//     const verificationToken = generateVerificationToken();
//     const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

//     user.emailVerificationToken = verificationToken;
//     user.emailVerificationExpires = verificationExpires;
//     await user.save();

//     // Send new verification email
//     const emailResult = await sendVerificationEmail(user, verificationToken);

//     if (!emailResult.success) {
//       return res.status(500).json({ message: "Failed to send verification email. Please try again later." });
//     }

//     res.status(200).json({
//       message: "Verification email sent! Please check your inbox.",
//     });
//   } catch (error) {
//     console.error("Resend verification error:", error);
//     res.status(500).json({ message: "Server error while resending verification email" });
//   }
// };


import User from "../models/User.js";
import LoginHistory from "../models/LoginHistory.js";
import jwt from "jsonwebtoken";
import {
  generateVerificationToken,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../utils/emailService.js";

/* ================================
   Helpers
================================ */

// JWT generator
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🔥 Cookie sender (IMPORTANT for production)
const sendTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // REQUIRED for https (Vercel + Render)
    sameSite: "none",    // REQUIRED for cross-domain
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/* ================================
   REGISTER
================================ */
export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email, and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Allow only user / manager from UI
    const allowedRole = role === "manager" ? "manager" : "user";

    const skipEmailVerification =
      process.env.SKIP_EMAIL_VERIFICATION === "true";

    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
      isEmailVerified: skipEmailVerification,
      emailVerificationToken: skipEmailVerification
        ? undefined
        : verificationToken,
      emailVerificationExpires: skipEmailVerification
        ? undefined
        : verificationExpires,
    });

    // 🔹 DEV MODE → auto login
    if (skipEmailVerification) {
      const token = generateToken(user._id);
      sendTokenCookie(res, token);

      return res.status(201).json({
        success: true,
        message: "Registration successful",
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      });
    }

    // 🔹 PROD MODE → email verification
    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please verify your email.",
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

/* ================================
   LOGIN
================================ */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const skipEmailVerification =
      process.env.SKIP_EMAIL_VERIFICATION === "true";

    if (!skipEmailVerification && !user.isEmailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        emailNotVerified: true,
      });
    }

    const token = generateToken(user._id);

    // 🔥 SET COOKIE (CRITICAL FIX)
    sendTokenCookie(res, token);

    // Login history (safe)
    try {
      await LoginHistory.create({
        user: user._id,
        checkIn: new Date(),
      });
    } catch (e) {}

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

/* ================================
   LOGOUT
================================ */
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    expires: new Date(0),
  });

  res.status(200).json({ success: true, message: "Logged out successfully" });
};

/* ================================
   VERIFY EMAIL
================================ */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired verification link",
        expired: true,
      });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    await sendWelcomeEmail(user);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
};

/* ================================
   RESEND VERIFICATION EMAIL
================================ */
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Email already verified" });
    }

    const verificationToken = generateVerificationToken();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    res.status(200).json({
      success: true,
      message: "Verification email sent",
    });
  } catch (error) {
    console.error("Resend email error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
