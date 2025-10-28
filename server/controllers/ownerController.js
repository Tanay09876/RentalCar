// import imagekit from "../configs/imageKit.js";
// import Booking from "../models/Booking.js";
// import Car from "../models/Car.js";
// import User from "../models/User.js";
// import fs from "fs";


// // API to Change Role of User
// // export const changeRoleToOwner = async (req, res)=>{
// //     try {
// //         const {_id} = req.user;
// //         await User.findByIdAndUpdate(_id, {role: "owner"})
// //         res.json({success: true, message: "Now you can list cars"})
// //     } catch (error) {
// //         console.log(error.message);
// //         res.json({success: false, message: error.message})
// //     }
// // }
// export const changeRoleToOwner = async (req, res) => {
//   try {
//     const { _id } = req.user;
//     const user = await User.findById(_id);

//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     if (user.role === "admin") {
//       return res.status(400).json({
//         success: false,
//         message: "Admin role cannot be changed to owner",
//       });
//     }

//     user.role = "owner";
//     await user.save();

//     res.json({ success: true, message: "Now you can list cars" });
//   } catch (error) {
//     console.log(error.message);
//     res.json({ success: false, message: error.message });
//   }
// };


// // API to List Car

// export const addCar = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         let car = JSON.parse(req.body.carData);
//         const imageFile = req.file;

//         // Upload Image to ImageKit
//         const fileBuffer = fs.readFileSync(imageFile.path)
//         const response = await imagekit.upload({
//             file: fileBuffer,
//             fileName: imageFile.originalname,
//             folder: '/cars'
//         })

//         // optimization through imagekit URL transformation
//         var optimizedImageUrl = imagekit.url({
//             path : response.filePath,
//             transformation : [
//                 {width: '1280'}, // Width resizing
//                 {quality: 'auto'}, // Auto compression
//                 { format: 'webp' }  // Convert to modern format
//             ]
//         });

//         const image = optimizedImageUrl;
//         await Car.create({...car, owner: _id, image})

//         res.json({success: true, message: "Car Added"})

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to List Owner Cars
// export const getOwnerCars = async (req, res)=>{
//     try {
//         const {_id} = req.user;
//         const cars = await Car.find({owner: _id })
//         res.json({success: true, cars})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to Toggle Car Availability
// export const toggleCarAvailability = async (req, res) =>{
//     try {
//         const {_id} = req.user;
//         const {carId} = req.body
//         const car = await Car.findById(carId)

//         // Checking is car belongs to the user
//         if(car.owner.toString() !== _id.toString()){
//             return res.json({ success: false, message: "Unauthorized" });
//         }

//         car.isAvaliable = !car.isAvaliable;
//         await car.save()

//         res.json({success: true, message: "Availability Toggled"})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // Api to delete a car
// export const deleteCar = async (req, res) =>{
//     try {
//         const {_id} = req.user;
//         const {carId} = req.body
//         const car = await Car.findById(carId)

//         // Checking is car belongs to the user
//         if(car.owner.toString() !== _id.toString()){
//             return res.json({ success: false, message: "Unauthorized" });
//         }

//         car.owner = null;
//         car.isAvaliable = false;

//         await car.save()

//         res.json({success: true, message: "Car Removed"})
//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to get Dashboard Data
// export const getDashboardData = async (req, res) =>{
//     try {
//         const { _id, role } = req.user;

//         if(role !== 'owner'){
//             return res.json({ success: false, message: "Unauthorized" });
//         }

//         const cars = await Car.find({owner: _id})
//         const bookings = await Booking.find({ owner: _id }).populate('car').sort({ createdAt: -1 });

//         const pendingBookings = await Booking.find({owner: _id, status: "pending" })
//         const completedBookings = await Booking.find({owner: _id, status: "confirmed" })
//          const cancelledBookings = await Booking.find({ owner: _id, status: "cancelled" });

       
//         const monthlyRevenue = bookings.slice().filter(booking => booking.status === 'confirmed').reduce((acc, booking)=> acc + booking.price, 0)

//         const dashboardData = {
//             totalCars: cars.length,
//             totalBookings: bookings.length,
//             pendingBookings: pendingBookings.length,
//             completedBookings: completedBookings.length,
//             cancelledBookings: cancelledBookings.length,
//             recentBookings: bookings.slice(0,3),
//             monthlyRevenue
             
//         }

//         res.json({ success: true, dashboardData });

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }

// // API to update user image

// export const updateUserImage = async (req, res)=>{
//     try {
//         const { _id } = req.user;

//         const imageFile = req.file;

//         // Upload Image to ImageKit
//         const fileBuffer = fs.readFileSync(imageFile.path)
//         const response = await imagekit.upload({
//             file: fileBuffer,
//             fileName: imageFile.originalname,
//             folder: '/users'
//         })

//         // optimization through imagekit URL transformation
//         var optimizedImageUrl = imagekit.url({
//             path : response.filePath,
//             transformation : [
//                 {width: '400'}, 
//                 {quality: 'auto'}, 
//                 { format: 'webp' }  
//             ]
//         });

//         const image = optimizedImageUrl;

//         await User.findByIdAndUpdate(_id, {image});
//         res.json({success: true, message: "Image Updated" })

//     } catch (error) {
//         console.log(error.message);
//         res.json({success: false, message: error.message})
//     }
// }   

import imagekit from "../configs/imageKit.js";
import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import fs from "fs";

// ✅ API to Change Role of User to Owner (except Admins)
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin role cannot be changed to owner",
      });
    }

    user.role = "owner";
    await user.save();

    res.json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Add Car
export const addCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const car = JSON.parse(req.body.carData);
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Car image is required" });
    }

    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });

    // Optimization through ImageKit URL transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await Car.create({ ...car, owner: _id, image: optimizedImageUrl });

    res.json({ success: true, message: "Car added successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Get All Cars of Owner
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Toggle Car Availability
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability toggled" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Delete Car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;
    const car = await Car.findById(carId);

    if (!car) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }

    if (car.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    await Car.findByIdAndDelete(carId);

    res.json({ success: true, message: "Car deleted successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Get Owner Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });
    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
    const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

    const monthlyRevenue = confirmedBookings.reduce((acc, b) => acc + b.price, 0);

    res.json({
      success: true,
      dashboardData: {
        totalCars: cars.length,
        totalBookings: bookings.length,
        pendingBookings: pendingBookings.length,
        completedBookings: confirmedBookings.length,
        cancelledBookings: cancelledBookings.length,
        recentBookings: bookings.slice(0, 3),
        monthlyRevenue,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ API to Update User Profile Image
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    // Upload Image to ImageKit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });

    // Optimization
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" },
        { quality: "auto" },
        { format: "webp" },
      ],
    });

    await User.findByIdAndUpdate(_id, { image: optimizedImageUrl });

    res.json({ success: true, message: "Profile image updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
