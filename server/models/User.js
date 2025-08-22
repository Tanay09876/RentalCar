


// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["owner", "user", "admin"], default: 'user' },
//   image: { type: String, default: '' },

//   // OTP fields for password reset
//   otp: { type: String },
//   otpExpiry: { type: Date },
// }, { timestamps: true });

// const User = mongoose.model('User', userSchema);

// export default User;
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, default: "" },
    role: {
      type: String,
      enum: ["user", "admin"], 
      default: "user",
    },
    carsOwned: [{ type: mongoose.Schema.Types.ObjectId, ref: "Car" }] 
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
