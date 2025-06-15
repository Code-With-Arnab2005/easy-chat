import { uploadOnCloudinary } from "../lib/cloudinary.js";
import Message from "../models/Message.model.js";
import User from "../models/User.model.js";
import { io, userSocketMap } from "../server.js";
import { getBotReply } from "./chatbot.controller.js";

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const senderId = req.user._id;
        const { id: receiverId } = req.params;
        if (!text && !image) {
            return res.json({ success: false, message: "Atleast one field is required to send message" });
        }
        let imageUrl;
        if (image) {
            const response = await uploadOnCloudinary(image);
            imageUrl = response.secure_url;
        }
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })
        if (!newMessage) {
            return res.json({ success: false, message: "Message not sent, please try again" })
        }

        //Emit the new message to the receivers socket
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        res.json({ success: true, message: "Message sent successsfully", message: newMessage })
        
        
        // console.log("sendmessage controller newmessage: ", newMessage)
        //create logic for chatbot reply
        const receiver = await User.findById(receiverId);
        if(receiver?.email === process.env.CHATBOT_EMAIL){
            const botReply = await getBotReply(text);
            if(botReply){
                const newBotMessage = await Message.create({
                    senderId: receiverId,
                    receiverId: senderId,
                    text: botReply,
                    image: imageUrl
                })
                if(newBotMessage){
                    //now send this reply of chatbot to the sender user
                    const senderSocketId = userSocketMap[senderId];
                    if(senderSocketId){
                        io.to(senderSocketId).emit("newMessage", newBotMessage);
                    }
                }
            }

        }
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const getUserforSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password")

        //number of message not seen for each user on sidebar
        const unseenMessages = {};
        const promises = filteredUsers.map(async (user) => {
            const unseenMessage = await Message.find({senderId: user._id, receiverId: userId, seen: false});
            if(unseenMessage && unseenMessage.length>0){
                unseenMessages[user._id] = unseenMessage.length;
            }
        })
        await Promise.all(promises);
        return res.json({success: true, message: "Users fetched successfully", unseenMessages, users: filteredUsers})
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const getMessagesForSelectedUser = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: selectedUserId } = req.params;
        // console.log(myId, selectedUserId)
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        })

        // console.log("message: ", messages);

        await Message.updateMany({senderId: selectedUserId, receiverId: myId}, {seen: true});
        return res.json({ success: true, message: "Messages fetched successfully", messages });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

const markMessageAsSeen = async(req, res) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, {seen: true})
        return res.json({ success: true, message: "Message seen successfully" });
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

export {
    sendMessage,
    getUserforSidebar,
    getMessagesForSelectedUser,
    markMessageAsSeen
}