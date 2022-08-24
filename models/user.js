/* class User {
    constructor(socketID, name, image) {
        this.socketID = socketID;
        this.name = name;
        this.image = image;
    }
}

module.exports = { User };
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 6,
        max: 14,
        required: true,
    },
    email: {
        type: String,
        min: 6,
        max: 255,
        required: true,
    },
    password: {
        type: String,
        min: 8,
        max: 64,
        required: true,
    },
    image: {
        type: String,
        default: "",
        required: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", userSchema);
