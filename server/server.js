
import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

const startServer = async () => {
  try {
    await connectDB(); // ✅ Await DB connection

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.get('/', (req, res) => res.send("Server is running"));
    app.use('/api/user', userRouter);
    app.use('/api/owner', ownerRouter);
    app.use('/api/bookings', bookingRouter);

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1); // Exit if DB connection fails
  }
};

startServer();

// import express from "express";
// import "dotenv/config";
// import cors from "cors";
// import connectDB from "./configs/db.js";
// import userRouter from "./routes/userRoutes.js";
// import ownerRouter from "./routes/ownerRoutes.js";
// import bookingRouter from "./routes/bookingRoutes.js";

// // Initialize Express App
// const app = express()

// // Connect Database
// await connectDB()

// // Middleware
// app.use(cors());
// app.use(express.json());

// app.get('/', (req, res)=> res.send("Server is running"))
// app.use('/api/user', userRouter)
// app.use('/api/owner', ownerRouter)
// app.use('/api/bookings', bookingRouter)

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`))