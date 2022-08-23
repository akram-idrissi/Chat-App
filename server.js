const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const { Server } = require("socket.io");
const { createServer } = require("http");
const session = require("express-session");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");
const { addUser } = require("./models/userDB.js");
const { findMessages, addMessage } = require("./models/messageDB.js");

dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server);

mongoose.connect(process.env.DATABASE_URL, () =>
    console.log("connected to db")
);

app.use(
    session({
        secret: "c3e4088a6b80e22cd4dbfcc63ada01bbbeb31b88463ee9c2cbf86eca268aa355e8e0bb80ddcb7d607d06c20965ac5e53b0fa2bdc8d09079c9ce9f28f76c4e9c1",
        saveUninitialized: true,
        resave: true,
    })
);

app.use(flash());

app.use(cookieParser());
app.use(express.json(), cors());
app.use(express.urlencoded({ extended: false }));

// setting the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views/components"));

// setting public files
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/assets"));

// setting views per path
app.use(function (req, res, next) {
    if (req.path.includes("auth"))
        app.set("views", path.join(__dirname, "views/auth"));
    else app.set("views", path.join(__dirname, "views/components"));
    next();
});

app.use("/auth", authRouter);
app.get("/chat", (req, res) => {
    res.render("chat");
});

/*
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
} */

server.listen(5000);
