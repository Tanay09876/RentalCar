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
import fs from "fs";
import imagekit from "../configs/imageKit.js";


// Function to Check Availability of Car for a given Date
const checkAvailability = async (car, pickupDate, returnDate)=>{
    const bookings = await Booking.find({
        car,
        status: { $ne: "cancelled" },
        pickupDate: {$lte: returnDate},
        returnDate: {$gte: pickupDate},
    })
    return bookings.length === 0;
}

// API to Check Availability of Cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res)=>{
    try {
        const {location, pickupDate, returnDate} = req.body

        if (!location || !pickupDate || !returnDate) {
            return res.json({ success: false, message: "Missing required fields" })
        }

        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        if (isNaN(picked.getTime()) || isNaN(returned.getTime())) {
            return res.json({ success: false, message: "Invalid date format" })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (picked < today) {
            return res.json({ success: false, message: "Pickup date cannot be in the past" })
        }

        if (returned < picked) {
            return res.json({ success: false, message: "Return date must be at or after pickup date" })
        }

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
    const licenseFile = req.files && req.files["licenseDocument"] ? req.files["licenseDocument"][0] : null;
    const govtIdFile = req.files && req.files["govtIdDocument"] ? req.files["govtIdDocument"][0] : null;

    try {
        const {_id} = req.user;
        const bookingDetails = req.body.bookingData ? JSON.parse(req.body.bookingData) : req.body;
        const {
            car,
            pickupDate,
            returnDate,
            licenseNumber,
            licenseExpiry,
            govtIdType,
            govtIdNumber,
            emergencyContactName,
            emergencyContactPhone
        } = bookingDetails;

        if (!car || !pickupDate || !returnDate || !licenseNumber || !licenseExpiry || !govtIdType || !govtIdNumber || !emergencyContactName || !emergencyContactPhone) {
            return res.json({ success: false, message: "Missing required booking or verification details" })
        }

        if (!licenseFile) {
            return res.json({ success: false, message: "Driving license document file is required" })
        }
        if (!govtIdFile) {
            return res.json({ success: false, message: "Government ID document file is required" })
        }

        // Validate File Formats and Sizes (Max 5MB)
        const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
        const maxFileSize = 5 * 1024 * 1024;

        if (!allowedMimeTypes.includes(licenseFile.mimetype)) {
            return res.json({ success: false, message: "Driving license document copy must be a JPEG, PNG, WEBP image or a PDF." });
        }
        if (licenseFile.size > maxFileSize) {
            return res.json({ success: false, message: "Driving license document copy must be less than 5MB." });
        }

        if (!allowedMimeTypes.includes(govtIdFile.mimetype)) {
            return res.json({ success: false, message: "Government ID document copy must be a JPEG, PNG, WEBP image or a PDF." });
        }
        if (govtIdFile.size > maxFileSize) {
            return res.json({ success: false, message: "Government ID document copy must be less than 5MB." });
        }

        // Parse and Validate Dates
        const picked = new Date(pickupDate);
        const returned = new Date(returnDate);

        if (isNaN(picked.getTime()) || isNaN(returned.getTime())) {
            return res.json({ success: false, message: "Invalid date format" })
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (picked < today) {
            return res.json({ success: false, message: "Pickup date cannot be in the past" })
        }

        if (returned < picked) {
            return res.json({ success: false, message: "Return date must be at or after pickup date" })
        }

        // Driving License Valdations
        const expiryDate = new Date(licenseExpiry);
        if (isNaN(expiryDate.getTime())) {
            return res.json({ success: false, message: "Invalid driving license expiry date format." });
        }
        if (expiryDate < returned) {
            return res.json({ success: false, message: "Driving license must be valid until at least the return date." });
        }

        const cleanLicenseNum = licenseNumber.trim();
        if (cleanLicenseNum.length < 5 || cleanLicenseNum.length > 30 || !/^[A-Za-z0-9\-\s]+$/.test(cleanLicenseNum)) {
            return res.json({ success: false, message: "Driving license number must be between 5 and 30 characters (alphanumeric, spaces, or hyphens)." });
        }

        // Government ID validations
        const acceptedTypes = ["Aadhar", "Passport", "PAN", "Voter ID"];
        const matchedType = acceptedTypes.find(t => t.toLowerCase() === govtIdType.trim().toLowerCase());
        if (!matchedType) {
            return res.json({ success: false, message: "Invalid Government ID type. Allowed types: Aadhar, Passport, PAN, Voter ID." });
        }

        const cleanIdNum = govtIdNumber.trim();
        if (matchedType === "Aadhar" && !/^\d{12}$/.test(cleanIdNum)) {
            return res.json({ success: false, message: "Aadhar Card number must be exactly 12 digits." });
        }
        if (matchedType === "PAN" && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(cleanIdNum)) {
            return res.json({ success: false, message: "PAN Card number must be exactly 10 characters in the standard format (e.g., ABCDE1234F)." });
        }
        if (matchedType === "Passport" && !/^[A-Z][0-9]{7,8}$/i.test(cleanIdNum)) {
            return res.json({ success: false, message: "Passport number must start with a letter followed by 7 or 8 digits." });
        }
        if (matchedType === "Voter ID" && !/^[A-Z0-9]{10}$/i.test(cleanIdNum)) {
            return res.json({ success: false, message: "Voter ID number must be exactly 10 alphanumeric characters." });
        }
        if (cleanIdNum.length < 4 || cleanIdNum.length > 25 || !/^[A-Z0-9\-\s]+$/i.test(cleanIdNum)) {
            return res.json({ success: false, message: "Government ID number must be between 4 and 25 characters." });
        }

        // Emergency Contact validations
        const cleanEmergencyName = emergencyContactName.trim();
        if (cleanEmergencyName.length < 2 || cleanEmergencyName.length > 50 || !/^[A-Za-z\s\.]+$/.test(cleanEmergencyName)) {
            return res.json({ success: false, message: "Emergency contact name must be between 2 and 50 characters and contain only letters." });
        }
        if (cleanEmergencyName.toLowerCase() === req.user.name.toLowerCase()) {
            return res.json({ success: false, message: "Emergency contact name cannot be your own name." });
        }

        const cleanEmergencyPhone = emergencyContactPhone.trim();
        const numericPhone = cleanEmergencyPhone.replace(/[\s\-\(\)\+]/g, "");
        if (numericPhone.length !== 10 || !/^\d+$/.test(numericPhone)) {
            return res.json({ success: false, message: "Emergency contact phone must be exactly 10 digits." });
        }

        // Calculate price based on pickupDate and returnDate (min 1 day)
        const diffTime = returned.getTime() - picked.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const noOfDays = diffDays <= 0 ? 1 : diffDays;

        const isAvailable = await checkAvailability(car, pickupDate, returnDate)
        if(!isAvailable){
            return res.json({success: false, message: "Car is not available for the selected dates"})
        }

        const carData = await Car.findById(car)
        if (!carData) {
            return res.json({ success: false, message: "Car not found" })
        }

        // Upload License Document to ImageKit
        const licenseBuffer = fs.readFileSync(licenseFile.path);
        const licenseResponse = await imagekit.upload({
            file: licenseBuffer,
            fileName: licenseFile.originalname,
            folder: "/booking_licenses",
        });

        // Upload Government ID Document to ImageKit
        const govtIdBuffer = fs.readFileSync(govtIdFile.path);
        const govtIdResponse = await imagekit.upload({
            file: govtIdBuffer,
            fileName: govtIdFile.originalname,
            folder: "/booking_govt_ids",
        });

        const price = carData.pricePerDay * noOfDays;

        await Booking.create({
            car,
            owner: carData.owner,
            user: _id,
            pickupDate,
            returnDate,
            price,
            licenseNumber,
            licenseExpiry: new Date(licenseExpiry),
            licenseDocument: licenseResponse.url,
            govtIdType: matchedType,
            govtIdNumber: cleanIdNum,
            govtIdDocument: govtIdResponse.url,
            emergencyContactName: cleanEmergencyName,
            emergencyContactPhone: cleanEmergencyPhone
        });

        res.json({success: true, message: "Booking Created Successfully"})

    } catch (error) {
        console.error("Booking error:", error.message);
        res.json({success: false, message: error.message})
    } finally {
        // Clean up uploaded temp files to prevent disk usage leaks
        if (licenseFile && fs.existsSync(licenseFile.path)) {
            try {
                fs.unlinkSync(licenseFile.path);
            } catch (err) {
                console.error("Temp file deletion error (license):", err.message);
            }
        }
        if (govtIdFile && fs.existsSync(govtIdFile.path)) {
            try {
                fs.unlinkSync(govtIdFile.path);
            } catch (err) {
                console.error("Temp file deletion error (govtId):", err.message);
            }
        }
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
