// import nodemailer from "nodemailer";
// import User from "../models/User.js";
// import imagekit from "../configs/imageKit.js";
// import Car from "../models/Car.js";
// import fs from "fs";

// // Get all users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, "name email"); // only select name & email
//     res.json({ success: true, users });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER, 
//     pass: process.env.SMTP_PASS, 
//   },
// });


// // Function to send mail
// export const sendMailToUser = async (req, res) => {
//   const { email, subject, message } = req.body;

//   if (!email || !subject || !message) {
//     return res.status(400).json({ success: false, message: "Missing fields" });
//   }

//   try {
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: subject,
//       text: message,
//     });

//     res.json({ success: true, message: "Mail sent successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Failed to send mail" });
//   }
// };




// // 📌 Update user
// export const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, email, role } = req.body;

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     user.name = name || user.name;
//     user.email = email || user.email;
//     user.role = role || user.role;

//     await user.save();
//     res.json({ success: true, message: "User updated successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // 📌 Delete user
// export const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ success: false, message: "User not found" });

//     await user.deleteOne();
//     res.json({ success: true, message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

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

import nodemailer from "nodemailer";
import User from "../models/User.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "name email"); // only select name & email
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER, 
    pass: process.env.SMTP_PASS, 
  },
});


// Function to send mail
export const sendMailToUser = async (req, res) => {
  const { email, subject, message } = req.body;

  if (!email || !subject || !message) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });

    res.json({ success: true, message: "Mail sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to send mail" });
  }
};




// 📌 Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.json({ success: true, message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.deleteOne();
    res.json({ success: true, message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};