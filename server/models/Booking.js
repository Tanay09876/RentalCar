import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const bookingSchema = new mongoose.Schema({
    car: {type: ObjectId, ref: "Car", required: true},
    user: {type: ObjectId, ref: "User", required: true},
    owner: {type: ObjectId, ref: "User", required: true},
    pickupDate: {type: Date, required: true},
    returnDate: {type: Date, required: true},
    status: {type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending"},
    price: {type: Number, required: true},
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    licenseDocument: { type: String, required: true },
    govtIdType: { type: String, required: true },
    govtIdNumber: { type: String, required: true },
    govtIdDocument: { type: String, required: true },
    emergencyContactName: { type: String, required: true },
    emergencyContactPhone: { type: String, required: true }
},{timestamps: true})

const Booking = mongoose.model('Booking', bookingSchema)

export default Booking