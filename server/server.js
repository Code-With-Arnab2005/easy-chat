import express from 'express';
import http from "http";
import cors from 'cors';
import "dotenv/config";
import { connectDB } from './lib/db.js';
import userRouter from "./routes/userRouter.route.js";
import messageRouter from "./routes/messageRouter.route.js";
import { Server } from 'socket.io';

//create express and http server
const app = express();
const server = http.createServer(app);

app.use(express.json({limit:'4mb'}));
app.use(cors());

//Initialize socket.io server
export const io = new Server(server, {
    cors: {origin: "*"}
})

//storing all the online users
export const userSocketMap = {}; //{userId: socketId}

//socket.io connection handler
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    // console.log("New user connected, userId: ", userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    //emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    //typing events
    socket.on("typing", ({ senderId, receiverId}) => {
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("show-typing", { senderId })
        }
    })
    socket.on("stop-typing", ({ senderId, receiverId }) => {
        const receiverSocketId = userSocketMap[receiverId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("hide-typing", { senderId })
        }
    })

    //disconnet event
    socket.on('disconnect', () => {
        // console.log("User disconnected: ", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    })

})

//setup all the routes
app.get("/", (req, res)=>{
    res.send("Real Time Chatting App")
})
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


// if(process.env.NODE_ENV!=='production'){
    //connec to the database
    await connectDB()
    .then(() => {
        const PORT = process.env.PORT || 3000
        server.listen(PORT, (req, res) => {
            console.log(`server is listening on port: ${PORT}`)
        })
    })
// }

//export server for Vercel
// export default server;Vercel
