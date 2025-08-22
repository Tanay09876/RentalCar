/* This JavaScript code snippet is a module that handles user authentication and profile management
functionalities for a web application. Here is a breakdown of what each part of the code does: */
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fs from "fs";
import Car from "../models/Car.js";
import imagekit from "../configs/imageKit.js";
import { sendOTPEmail, sendWelcomeEmail } from "../utils/mailer.js";

// In-memory store for OTPs
const otpStore = new Map();

// Generate JWT Token
const generateToken = (userId) => {
  const payload = userId;
  return jwt.sign(payload, process.env.JWT_SECRET);
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password || password.length < 8) {
      return res.json({ success: false, message: 'Fill all the fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    const token = generateToken(user._id.toString());

    await sendWelcomeEmail(email, name);

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = generateToken(user._id.toString());

    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get User Data
export const getUserData = async (req, res) => {
  try {
    const { user } = req;
    res.json({ success: true, user });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get All Cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({ isAvaliable: true });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Send OTP
export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ success: false, message: "Email not registered" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(email, otp);

    setTimeout(() => otpStore.delete(email), 10 * 60 * 1000);

    await sendOTPEmail(email, otp);
    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Verify OTP & Reset Password
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const storedOtp = otpStore.get(email);

    if (!storedOtp || storedOtp !== otp) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    otpStore.delete(email);
    res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Get user profile (by token)
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-__v");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile (name, email, password, image)
export const updateProfile = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // If image was uploaded via multer
    if (req.file) {
      user.image = `/uploads/${req.file.filename}`;
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};