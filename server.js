const path = require("path");
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { addUser } = require("./models/userDB.js");
const { findMessages, addMessage } = require("./models/messageDB.js");

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/chat"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/assets"));

var counter = 1;
var usersList = [];
var temporaryName = `akram ${counter}`;
var image = `https://bootdey.com/img/Content/avatar/avatar${counter}.png`;

app.get("/chat", (req, res) => {
    res.render("chat");
});

io.on("connection", async (socket) => {
    // when first entered the app
    updateData(counter++);
    usersList.push(await addUser(socket.id, temporaryName, image));
    io.emit("usersList", usersList);

    // when client send a msg
    socket.on("client-msg", async (text, receiverID) => {
        let message = "";
        let sender = usersList.filter((user) => user.socketID == socket.id)[0];
        let receiver = usersList.filter(
            (user) => user.socketID == receiverID
        )[0];
        message = await addMessage(sender, receiver, text);
        socket.to(receiverID).emit("server-msg", message);
        socket.emit("sender", message);
    });

    // load msgs on when clicking an online user
    socket.on("load-msgs", async (receiverID) => {
        let messages = [];
        let sender = usersList.filter((user) => user.socketID == socket.id)[0];
        let receiver = usersList.filter(
            (user) => user.socketID == receiverID
        )[0];
        messages = await findMessages(sender, receiver);
        socket.emit("private-msgs", messages, socket.id);
    });
});

function updateData(c) {
    temporaryName = `akram ${c}`;
    image = `https://bootdey.com/img/Content/avatar/avatar${c}.png`;
}

server.listen(5000);
