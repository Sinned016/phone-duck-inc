import express from "express";
import { Server } from "socket.io";

const app = express();
app.use(express.json())

const JWT_SECRET_KET = 'catsareawesomebutdogsareawesometoo'
let clients = [];

const server = app.listen(5000, () => {
    console.log('Application started on port 5000!');
});


const socketIo = new Server(server, {
    cors: {
      origin: '*', // Allow any origin for testing purposes. This should be changed on production.
    },
});


socketIo.on("connection", (socket) => {
    const authHeader = socket.handshake.headers.authorization
    const authToken = authHeader.replace("Bearer ", "");

    console.log("A new client connected");

    socket.jwt = authToken
    clients.push(socket)

    clients.forEach(client => {
        client.emit("new-connection", clients.length + " users has connected")
    })

    // Använder socket.on istället för socketIo.on för då handlar det om just DEN socketen som användaren är på just nu
    // socketIo.on är för alla sockets
    socket.on("disconnect", () => {
        console.log("User left")
        clients = clients.filter(client => client != socket)
    })
});

app.get("/channel/", (req, res) => {
    console.log("channel socket emitted")
    
    clients.forEach(client => {
        client.emit("new-channel", "Updated channels")
    })
    
    res.status(200).send("ping ping")
})

app.get("/message/", (req, res) => {
    console.log("message socket emitted")

    clients.forEach(client => {
        client.emit("new-message", req.query.id)
    })
    
    res.status(200).send("ping ping")
})

app.get("/broadcast/", (req, res) => {
    console.log("broadcast socket")
    
    clients.forEach(client => {
        client.emit("new-broadcast", "Socket refreshed data")
    })
    
    res.status(200).send("pinging broadcast")
})