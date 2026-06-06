import jwt from "jsonwebtoken";
import User from "../models/User.js";

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
        req.user = await User.findById(userId).select("-password")
        next();
    } catch (error) {
        return res.json({success: false, message: "not authorized"})
    }
}



