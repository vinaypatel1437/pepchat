const express = require("express");
const path = require("path")
const http = require("http");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages")
const {userJoin,getCurrentUser,userLeave,getRoomUsers} = require("./utils/users");
const { use } = require("express/lib/application");

// making express object and send to the http server than the server is passed to the socketio
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const botname = "Pepbot";

//Joining the path of the file to the server
app.use(express.static(path.join((__dirname,'public'))));

// Connected to the client
io.on('connection',socket=>{
    
    socket.on('join',({username,room})=>{
        const user = userJoin(socket.id,username,room);
        socket.join(user.room)
        //Only to the client who is connected
        socket.emit("message",formatMessage(botname,"Welcome to Chatboot"))
        //All the clients except the client who is connected
        socket.broadcast.to(user.room).emit("message",formatMessage(botname,`${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        })
    })
    //All the general clients
    // io.emit();
    // Message is sent when user is disconnected
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){

            io.to(user.room).emit('message',formatMessage(botname,`${user.username} has left the chat`))
            io.to(user.room).emit('roomUsers',{
                room: user.room,
                users:getRoomUsers(user.room)
            })
        }
    });
    //Getting the chat message
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,msg));

    })
})

// Listening to the port 5000 or general port.
const PORT = process.env.PORT || 5000 ;
server.listen(PORT,()=>console.log(`Sever is running ${PORT}`));
