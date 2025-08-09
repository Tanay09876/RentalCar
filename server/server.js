
// server.js
import express from "express";
import cors from "cors";
import "dotenv/config";

import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Global Middlewares
    app.use(cors());
    app.use(express.json());

    // Test Route
    app.get("/", (req, res) => res.send("🚗 Car Rental API is running"));

    // API Routes
    app.use("/api/user", userRouter);
    app.use("/api/owner", ownerRouter);
    app.use("/api/bookings", bookingRouter);

    // Start Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();


// // server.js
// import express from "express";
// import cors from "cors";
// import "dotenv/config";

// import connectDB from "./configs/db.js";
// import userRouter from "./routes/userRoutes.js";
// import ownerRouter from "./routes/ownerRoutes.js";
// import bookingRouter from "./routes/bookingRoutes.js";

// const app = express();

// const startServer = async () => {
//   try {
//     // Connect to MongoDB
//     await connectDB();

//     // Middlewares
//     app.use(cors());
//     app.use(express.json());

//     // API Routes
//     app.get("/", (req, res) => res.send("🚗 Car Rental API is running"));
//     app.use("/api/user", userRouter);
//     app.use("/api/owner", ownerRouter);
//     app.use("/api/bookings", bookingRouter);

//     // Start Express server
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//       console.log(`✅ Server running on http://localhost:${PORT}`);
//     });

//   } catch (error) {
//     console.error("❌ Failed to start server:", error.message);
//     process.exit(1); // Terminate the process on failure
//   }
// };

// startServer();







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