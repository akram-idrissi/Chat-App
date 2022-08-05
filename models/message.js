class Message {
    constructor(senderID, receiverID, sender, receiver, text) {
        this.senderID = senderID;
        this.receiverID = receiverID;
        this.sender = sender;
        this.receiver = receiver;
        this.text = text;
    }
}

module.exports = { Message };

/* const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    senderID: {
        type: String,
        required: true,
    },
    receiverID: {
        type: String,
        required: true,
    },
    sender: {
        type: Object,
        required: true,
    },
    receiver: {
        type: Object,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    sentAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Message", messageSchema);
 */
