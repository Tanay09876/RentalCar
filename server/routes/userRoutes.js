// routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import fs from "fs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Car from "../models/Car.js";
import {
  loginUser,
  getUserData,
  getCars,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/multer.js";
import imagekit from "../configs/imageKit.js";
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

    const token = jwt.sign(user._id.toString(), process.env.JWT_SECRET);

    await sendWelcomeEmail(email, name);
    res.status(201).json({ success: true, token, role: user.role, message: "User registered successfully" });
  } catch (err) {
    console.error("❌ Register Error:", err);
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

// ✅ Verify OTP and Reset Password
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
    const user = await User.findById(req.user._id).select("-password -otp -otpExpiry");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Update Profile Route
router.put("/update-profile", protect, upload.single("image"), async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update name
    if (name) user.name = name;

    // Update email (check if not already used)
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    // Update password
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      if (password.length < 8) {
        return res.status(400).json({ message: "Password must be at least 8 characters" });
      }
      user.password = await bcrypt.hash(password, 10);
    }

    // Update image if uploaded
    if (req.file) {
      try {
        const fileBuffer = fs.readFileSync(req.file.path);
        const uploadedImage = await imagekit.upload({
          file: fileBuffer,
          fileName: req.file.originalname,
        });

        user.image = uploadedImage.url;
      } finally {
        if (fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      }
    }

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: user.name,
        email: user.email,
        image: user.image
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ✅ Add Review to a Car
router.post("/cars/:id/reviews", protect, async (req, res) => {
  const { rating, comment } = req.body;
  const carId = req.params.id;

  try {
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: "Please provide rating and comment" });
    }

    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    // Check if user already reviewed this car
    const alreadyReviewed = car.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "You have already reviewed this car" });
    }

    const review = {
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    };

    car.reviews.push(review);
    car.rating =
      car.reviews.reduce((acc, item) => item.rating + acc, 0) /
      car.reviews.length;

    await car.save();
    res.status(201).json({ success: true, message: "Review added successfully", rating: car.rating, reviews: car.reviews });
  } catch (error) {
    console.error("Add Review Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default router;