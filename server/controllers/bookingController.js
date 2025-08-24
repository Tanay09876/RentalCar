// import Booking from "../models/Booking.js"
// import Car from "../models/Car.js";


// // Function to Check Availability of Car for a given Date
// const checkAvailability = async (car, pickupDate, returnDate)=>{
//     const bookings = await Booking.find({
//         car,
//         pickupDate: {$lte: returnDate},
//         returnDate: {$gte: pickupDate},
//     })
//     return bookings.length === 0;
// }

// // API to Check Availability of Cars for the given Date and location
// export const checkAvailabilityOfCar = async (req, res)=>{
//     try {
//         const {location, pickupDate, returnDate} = req.body

//         // fetch all available cars for the given location
//         const cars = await Car.find({location, isAvaliable: true})

//         // check car availability for the given date range using promise
//         const availableCarsPromises = cars.map(async (car)=>{
//            const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
//            return {...car._doc, isAvailable: isAvailable}
//         })

//         let availableCars = await Promise.all(availableCarsPromises);
//         availableCars = availableCars.filter(car => car.isAvailable === true)

//         res.json({success: true, availableCars})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to Create Booking
// export const createBooking = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         const {car, pickupDate, returnDate} = req.body;

//         const isAvailable = await checkAvailability(car, pickupDate, returnDate)
//         if(!isAvailable){
//             return res.json({success: false, message: "Car is not available"})
//         }

//         const carData = await Car.findById(car)

//         // Calculate price based on pickupDate and returnDate
//         const picked = new Date(pickupDate);
//         const returned = new Date(returnDate);
//         const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
//         const price = carData.pricePerDay * noOfDays;

//         await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

//         res.json({success: true, message: "Booking Created"})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to List User Bookings 
// export const getUserBookings = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
//         res.json({success: true, bookings})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to get Owner Bookings

// export const getOwnerBookings = async (req, res)=>{
//     try {
//         if(req.user.role !== 'owner'){
//             return res.json({ success: false, message: "Unauthorized" })
//         }
//         const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
//         res.json({success: true, bookings})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to change booking status
// export const changeBookingStatus = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         const {bookingId, status} = req.body

//         const booking = await Booking.findById(bookingId)

//         if(booking.owner.toString() !== _id.toString()){
//             return res.json({ success: false, message: "Unauthorized"})
//         }

//         booking.status = status;
//         await booking.save();

//         res.json({ success: true, message: "Status Updated"})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // bookingController.js
// export const getAllBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find().populate("car").populate("user");
//     res.json({ success: true, bookings });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
import Booking from "../models/Booking.js"
import Car from "../models/Car.js";


// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        // fetch all available cars for the given location
        const cars = await Car.find({location, isAvaliable: true})

        // check car availability for the given date range using promise
        const availableCarsPromises = cars.map(async (car)=>{
           const isAvailable = await checkAvailability(car._id, pickupDate, returnDate)
           return {...car._doc, isAvailable: isAvailable}
        })

        let availableCars = await Promise.all(availableCarsPromises);
        availableCars = availableCars.filter(car => car.isAvailable === true)

        res.json({success: true, availableCars})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to Create Booking
export const createBooking = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {car, pickupDate, returnDate} = req.body;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available"})
        }

        const carData = await Car.findById(car)

        // Calculate price based on pickupDate and returnDate
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);
        const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24))
        const price = carData.pricePerDay * noOfDays;

        await Booking.create({car, owner: carData.owner, user: _id, pickupDate, returnDate, price})

        res.json({success: true, message: "Booking Created"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to List User Bookings 
export const getUserBookings = async (req, res)=>{
    try {
        const {_id} = req.user;
        const bookings = await Booking.find({ user: _id }).populate("car").sort({createdAt: -1})
        res.json({success: true, bookings})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to get Owner Bookings

export const getOwnerBookings = async (req, res)=>{
    try {
        if(req.user.role !== 'owner'){
            return res.json({ success: false, message: "Unauthorized" })
        }
        const bookings = await Booking.find({owner: req.user._id}).populate('car user').select("-user.password").sort({createdAt: -1 })
        res.json({success: true, bookings})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// API to change booking status
export const changeBookingStatus = async (req, res)=>{
    try {
        const {_id} = req.user;
        const {bookingId, status} = req.body

        const booking = await Booking.findById(bookingId)

        if(booking.owner.toString() !== _id.toString()){
            return res.json({ success: false, message: "Unauthorized"})
        }

        booking.status = status;
        await booking.save();

        res.json({ success: true, message: "Status Updated"})
    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// bookingController.js
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("car").populate("user");
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to Cancel a Booking (User or Owner)
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id
    const userId = req.user._id

    const booking = await Booking.findById(bookingId)
    if (!booking) {
      return res.json({ success: false, message: "Booking not found" })
    }

    // ✅ Only the user who booked OR the owner of the car can cancel
    if (
      booking.user.toString() !== userId.toString() &&
      booking.owner.toString() !== userId.toString()
    ) {
      return res.json({ success: false, message: "Unauthorized" })
    }

    // ✅ Already cancelled
    if (booking.status === "cancelled") {
      return res.json({ success: false, message: "Booking already cancelled" })
    }

    // ✅ Only confirmed/pending bookings can be cancelled
    if (booking.status !== "confirmed" && booking.status !== "pending") {
      return res.json({ success: false, message: "Booking cannot be cancelled now" })
    }

    booking.status = "cancelled"
    await booking.save()

    // (Optional) Free up the car again
    await Car.findByIdAndUpdate(booking.car, { isAvaliable: true })

    res.json({ success: true, message: "Booking cancelled successfully", booking })
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ success: false, message: error.message })
  }
}
