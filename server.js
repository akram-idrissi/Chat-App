const cors = require("cors");
const path = require("path");
const cookie = require("cookie");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { isAuth } = require("./lib/token");
const { getUser } = require("./lib/utils");
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();
const server = createServer(app);

mongoose.connect(process.env.DATABASE_URL, () =>
    console.log("connected to db")
);

app.use(cookieParser());
app.use(express.json(), cors());
app.use(express.urlencoded({ extended: false }));

// setting the view engine
app.set("view engine", "ejs");

// setting public files
app.use(express.static("public"));
app.use(express.static("public/js"));
app.use(express.static("public/css"));
app.use(express.static("public/assets"));

// rendrering views according to path
app.use(function (req, res, next) {
    if (req.path.includes("auth"))
        app.set("views", path.join(__dirname, "views/auth"));
    else app.set("views", path.join(__dirname, "views/components"));
    next();
});

// routes
app.use("/auth", authRouter);
app.get("/chat", isAuth, (req, res) => {
    res.render("chat");
});

var counter = 1;
var usersList = [];
var temporaryName = `akram ${counter}`;
var image = `https://bootdey.com/img/Content/avatar/avatar${counter}.png`;

/* lgoic */
const io = new Server(server);
io.on("connection", async (socket) => {
    // when user is connected
    const cookies = cookie.parse(socket.handshake.headers.cookie);
    const user = getUser(cookies);
    






    /* 
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
    }); */
});

function updateData(c) {
    temporaryName = `akram ${c}`;
    image = `https://bootdey.com/img/Content/avatar/avatar${c}.png`;
}

server.listen(5000);
