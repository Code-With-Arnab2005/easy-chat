import mongoose from "mongoose";

const userScehema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true,
        minlenght: 6
    },
    profilePicture: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
}, {timestamps: true})

const User = mongoose.model("User", userScehema);
export default User;