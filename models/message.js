const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    sender: {
        type: Object,
        default: {},
    },
    receiver: {
        type: Object,
        default: {},
    },
    text: {
        type: String,
        default: "",
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Message", messageSchema);
