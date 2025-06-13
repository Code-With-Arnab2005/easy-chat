import jwt from 'jsonwebtoken';

export const generateToken = async(userId) => {
    try {
        const token = jwt.sign({userId}, process.env.JWT_SECRET);
        if(!token){
            console.log("Somthing went wrong while generting token")
        }
        return token;
    } catch (error) {
        console.log("Error generating token")
    }
}