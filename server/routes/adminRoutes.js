import express from "express";
import { protect } from "../middleware/auth.js"; // JWT auth
import { adminOnly } from "../middleware/admin.js"; // Admin role check
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import { getAllUsers } from "../controllers/adminController.js";

import { changeBookingStatus, checkAvailabilityOfCar, createBooking, getOwnerBookings, getUserBookings } from "../controllers/bookingController.js";
import { sendMailToUser } from "../controllers/adminController.js"
const router = express.Router();

// Admin Dashboard Data
router.get("/dashboard", protect, adminOnly, async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("car", "brand model")
      .populate("user", "name email")
      .lean();

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthlyRevenueAgg = await Booking.aggregate([
      { $match: { status: "completed", createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$price" } } }
    ]);
    const monthlyRevenue = monthlyRevenueAgg[0]?.total || 0;

    res.json({
      success: true,
      dashboardData: {
        totalCars,
        totalBookings,
        pendingBookings,
        completedBookings,
        recentBookings,
        monthlyRevenue
      }
    });
  } catch (err) {
    console.error("Admin dashboard error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get All Users
router.get("/users", protect, adminOnly, getAllUsers);

// ✅ Admin: Get All Bookings
router.get("/manage-bookings", protect, adminOnly, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("car", "brand model price")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (err) {
    console.error("Admin manage bookings error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Optional: change booking status (admin only)
router.post("/change-status", protect, adminOnly, changeBookingStatus);

// Other booking routes (user/owner)
router.post("/check-availability", checkAvailabilityOfCar);
router.post("/create", protect, createBooking);
router.get("/user", protect, getUserBookings);
router.get("/owner", protect, getOwnerBookings);
router.post("/send-mail", protect, adminOnly, sendMailToUser);
export default router;
