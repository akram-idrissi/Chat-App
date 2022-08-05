class User {
    constructor(socketID, name, image) {
        this.socketID = socketID;
        this.name = name;
        this.image = image;
    }
}

module.exports = { User };

/* const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    socketID: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("User", userSchema);
 */
