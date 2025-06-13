import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';

export const isAuthenticated = async(req, res, next) => {
    try {
        const token = req.headers.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if(!decodedToken){
            return res.json({success: false, message: "User not authenticated"})
        }
        const userId = decodedToken.userId;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.json({success: false, message: "User not authenticated"})
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}