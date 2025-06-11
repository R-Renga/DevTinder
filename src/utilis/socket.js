const socket = require('socket.io');

const initializeSocket = (server)=>{
const io = socket(server,{
    cors:{
        origin:"http://localhost:5173",
        credentials:true
    }
}) 

io.on('connection',(socket)=>{
    socket.on("join chat",()=>{})
    socket.on("send message",()=>{})
    socket.on("disconnect",()=>{})
})
}


module.exports = initializeSocket;