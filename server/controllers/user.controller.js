import User from "../models/User.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";
import { uploadOnCloudinary } from "../lib/cloudinary.js";

const signup = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        if (!fullname || !email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        if(email===process.env.CHATBOT_EMAIL){
            return res.json({ success: false, message: "This email is secured, Please create account with another Email Id" })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "User already exists, sign-up with another email" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword
        })
        const token = await generateToken(newUser._id);
        if (!token) {
            return res.json({ success: false, message: "Token not generated, please try again later" });
        }
        return res.json({ success: true, message: "Account created successfully", userData: newUser, token })
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        if(email===process.env.CHATBOT_EMAIL){
            return res.json({ success: false, message: "This email is secured, Please create account with another Email Id" })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: "User not found, please try again" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.json({ success: false, message: "Password is incorrect!" });
        }
        const token = await generateToken(user._id);
        if (!token) {
            return res.json({ success: false, message: "Token not generated, please try again later" });
        }
        return res.json({ success: true, message: "User Logged in successfully", token, userData: user })

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const setBio = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bio } = req.body;
        if (!bio || !userId) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const user = await User.findByIdAndUpdate(userId, { bio }, { new: true });
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        return res.json({ success: true, userData: user, message: "Bio updated successfully" });

    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const updateProfilePicture = async (req, res) => {
    try {
        const userId = req.user._id;
        const { profilePicture } = req.body;
        const res = await uploadOnCloudinary(profilePicture);
        const user = await User.findByIdAndUpdate(userId, { profilePicture: res.secure_url }, { new: true })
        return res.json({ success: true, message: "Profile Picture updated successfully", userData: user });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const getCurrentUser = async (req, res) => {
    try {
        
        return res.json({ success: true, message: "User fetched successfully", userData: req.user });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

export {
    signup,
    login,
    setBio,
    updateProfilePicture,
    getCurrentUser,

}