import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Car from "../models/Car.js";

export const protect = async (req, res, next)=>{
    let token = req.headers.authorization;
    if(!token){
        return res.json({success: false, message: "not authorized"})
    } 
    try {
        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id || decoded; // handles both object/string payloads safely

        if(!userId  ){
            return res.json({success: false, message: "not authorized"})
        }
        const userDoc = await User.findById(userId).select("-password");
        if (!userDoc) {
            return res.json({success: false, message: "not authorized"})
        }

        const user = userDoc.toObject();
        if (user.role === "owner") {
            const cars = await Car.find({ owner: userId }).select("_id");
            user.carsOwned = cars.map(c => c._id);
        }

        req.user = user;
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}



