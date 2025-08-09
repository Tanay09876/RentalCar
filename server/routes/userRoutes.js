









// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   getUserData,
//   getCars,
//   sendOTP,
//   verifyOTP
// } from "../controllers/userController.js";
// import { protect } from "../middleware/auth.js";

// const userRouter = express.Router();

// userRouter.post('/register', registerUser);
// userRouter.post('/login', loginUser);
// userRouter.get('/data', protect, getUserData);
// userRouter.get('/cars', getCars);
// userRouter.post('/send-otp', sendOTP);
// userRouter.post('/verify-otp', verifyOTP);

// export default userRouter;







// routes/userRoutes.js

import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  loginUser,
  getUserData,
  getCars,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import { sendOTPEmail, sendWelcomeEmail } from "../utils/mailer.js";

const router = express.Router();

// ✅ Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await sendWelcomeEmail(email, name);
    res.status(201).json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Login
router.post("/login", loginUser);

// ✅ Get logged-in user data
router.get("/data", protect, getUserData);

// ✅ Get all cars (public)
router.get("/cars", getCars);

// ✅ Send OTP
router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = expiry;
    await user.save();

    await sendOTPEmail(email, otp);
    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//  Verify OTP and Reset Password
router.post("/verify-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpiry)
      return res.status(400).json({ message: "OTP not requested" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiry < Date.now())
      return res.status(400).json({ message: "OTP expired" });

    if (newPassword.length < 8)
      return res.status(400).json({ message: "Password must be at least 8 characters" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Get Profile Info
router.get("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password -otp -otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Profile
router.put("/update-profile", protect, async (req, res) => {
  const { name, password, confirmPassword } = req.body;

  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;

    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;



