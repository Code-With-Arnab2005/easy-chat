import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from "react-hot-toast";
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [authUser, setAuthUser] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [socket, setSocket] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    const chechAuth = async() => {
        setLoadingAuth(true);
        try {
            const {data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.userData);
                connectSocket(data.userData);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Something went wrong")
        } finally {
            setLoadingAuth(false);
        }
    }

    //login function to handle user authentication and socket connection
    const login = async(state, credentials) => {
        try {
            const { data } = await axios.post(`/api/auth/${state}`, credentials);
            if(data.success){
                // console.log("login: ", data);
                setAuthUser(data.userData);
                connectSocket(data.userData);
                axios.defaults.headers.common["token"] = data.token;
                setToken(data.token)
                localStorage.setItem("token", data.token);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //logout function to handle user logout and socket disconnection
    const logout = async() => {
        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUsers([]);
        axios.defaults.headers.common["token"] = null;
        toast.success("User logged out successfully");
        socket.disconnect();
    }

    //updata bio function to handle user bio update
    const updateBio = async(bio) => {
        try {
            const { data } = await axios.post("/api/auth/set-bio", bio);
            // console.log("setbio: ", data);
            if(data.success){
                setAuthUser(data.userData);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //update profile picture function to handle user profile picture upload
    const updateProfilePicture = async(body) => {
        try {
            const { data } = await axios.post("/api/auth/update-profile-picture", body);
            if(data.success){
                setAuthUser(data.userData);
                toast.success(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const connectSocket = (userData) => {
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })
        newSocket.connect();
        setSocket(newSocket);

        newSocket.on("getOnlineUsers", (userId) => {
            setOnlineUsers(userId)
        })

        //typing events
        newSocket.on("show-typing", ({ senderId }) => {
            setIsTyping(senderId);
        })
        newSocket.on("hide-typing", ({ senderId }) => {
            setIsTyping(false);
        })
    }

    const emitTyping = (receiverId) => {
        if(socket && socket.connected){
            socket.emit("typing", {
                senderId: authUser?._id,
                receiverId 
            })
        }
    }

    const emitStopTyping = (receiverId) => {
        if(socket && socket.connected){
            socket.emit("stop-typing", {
                senderId: authUser?._id,
                receiverId
            })
        }
    }

    useEffect(() => {
        if(token){
            axios.defaults.headers.common["token"] = token;
        }
        chechAuth();
    }, [])

    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateBio,
        updateProfilePicture,
        loadingAuth,
        emitTyping,
        emitStopTyping,
        isTyping,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    ) 
}