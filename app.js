const express = require("express");
const socket = require("socket.io");
const app = express();  // Initialize and Sever ready

app.use(express.static("public"));  // for server information about our public folder(frontend) to check index.html and render it via port number/url


let port = process.env.PORT || 3000;
const server = app.listen(port, () => {  // for functioning/listening server
    console.log("Listening to port 3000");
})

const io = socket(server);

io.on("connection", (socket) => {
    console.log("Made socket connection"); // it'll make connection everytime where new device connected to server

    socket.on("drawStroke", (data) => {
        io.sockets.emit("drawStroke", data);
    })

    // Received Data
    // from app.js when data send to server we use .on() for listening data from frontend.
    socket.on("beginPath", (data) => { // Type of listner who triggeres data when "beginPath" named event happens
        // Now Transfering data to all connected computers
        io.sockets.emit("beginPath", data);
    })
    socket.on("undoRedo", (data) => {
        io.sockets.emit("undoRedo", data);
    })
})


/**
Nodemon:
nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes 
in the directory are detected.
nodemon does not require any additional changes to your code or method of development. nodemon is a replacement wrapper for node. To 
use nodemon, replace the word node on the command line when executing your script.

 */
