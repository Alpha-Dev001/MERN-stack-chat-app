import jwt from "jsonwebtoken";
import User from "../models/User.js";

//Middleware to protect routes 
export const protectRoute = async (req, res, next) => {
    try {
        // Check if token exists
        const token = req.headers.token;
        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and exclude password
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ success: false, message: "Invalid token" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired" });
        } else {
            return res.status(401).json({ success: false, message: "Authentication failed" });
        }
    }
}