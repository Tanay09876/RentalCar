import mongoose from "mongoose";
const {ObjectId} = mongoose.Schema.Types

const carSchema = new mongoose.Schema({
    owner: {type: ObjectId, ref: 'User'},
    brand: {type: String, required: true},
    model: {type: String, required: true},
    image: {type: String, required: true},
    year: {type: Number, required: true},
    category: {type: String, required: true},
    seating_capacity: {type: Number, required: true},
    fuel_type: { type: String, required: true },
    transmission: { type: String, required: true },
    pricePerDay: { type: Number, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    isAvaliable: {type: Boolean, default: true},
    registrationNumber: { type: String, required: true },
    insuranceNumber: { type: String, required: true },
    insuranceExpiry: { type: Date, required: true },
    rcDocument: { type: String, required: true },
    reviews: [
      {
        user: { type: ObjectId, ref: 'User', required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    rating: { type: Number, default: 0 }
},{timestamps: true})

const Car = mongoose.model('Car', carSchema)

export default Car