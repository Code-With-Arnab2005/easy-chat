import { createContext, useContext, useEffect, useState } from "react";
import {AuthContext} from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({children}) => {

    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages] = useState({});

    const { axios, socket, authUser } = useContext(AuthContext);

    //function to get all users for sidebar
    const getAllUsersForSidebar = async() => {
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUsers(data.users);
                setUnseenMessages(data.unseenMessages);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const getMessagesForSelectedUser = async(userId) => {
        try {
            // console.log(userId)
            const { data } = await axios.get(`/api/messages/${userId}`);
            // console.log("message data: ", data)
            if(data.success){
                setMessages(data.messages)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const sendMessage = async(messageData) => {
        try {
            // console.log("messageData: ", messageData)
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            // console.log("sendmessage: ", data)
            if(data.success){
                setMessages((prev) => [...prev, data.message]);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to subscribe message to selected user
    const subscribeToMessage = async() => {
        try {
            if(!socket) return;

            socket.on('newMessage', (newMessage) => {
                if(selectedUser && newMessage.senderId === selectedUser._id){
                    newMessage.seen = true;
                    setMessages((prev) => [...prev, newMessage]);
                    const { data } = axios.put(`/api/messages/mark/${newMessage._id}`);
                    if(!data.success){
                        toast.error(data.message);
                    }
                } else {
                    setUnseenMessages((prevUnseenMessages) => ({
                        ...prevUnseenMessages, [newMessage.senderId] : prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 : 1
                    }))
                }
            })
        } catch(error){
            toast.error(error.message);
        }
    }

    const unsubscribeFromMessages = async() => {
        if(socket) socket.off("newMessage");
    }

    useEffect(() => {
        subscribeToMessage();
        return () => unsubscribeFromMessages();
    }, [socket, selectedUser])

    const value = {
        messages, users, selectedUser, getAllUsersForSidebar, setMessages, sendMessage, setSelectedUser, unseenMessages, setUnseenMessages, getMessagesForSelectedUser
    }

    return <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
}