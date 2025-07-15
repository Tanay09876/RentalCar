// import express from "express";
// import { getCars, getUserData, loginUser, registerUser } from "../controllers/userController.js";
// import { protect } from "../middleware/auth.js";

// const userRouter = express.Router();

// userRouter.post('/register', registerUser)
// userRouter.post('/login', loginUser)
// userRouter.get('/data', protect, getUserData)
// userRouter.get('/cars', getCars)

// export default userRouter;




import express from "express";
import {
  registerUser,
  loginUser,
  getUserData,
  getCars,
  sendOTP,
  verifyOTP
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/data', protect, getUserData);
userRouter.get('/cars', getCars);
userRouter.post('/send-otp', sendOTP);
userRouter.post('/verify-otp', verifyOTP);

export default userRouter;
