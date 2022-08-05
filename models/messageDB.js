const mongodb = require("mongodb");
require("dotenv").config();

const MongoClient = mongodb.MongoClient;

var client;

const connectDB = async () => {
    if (!client) client = await MongoClient.connect(process.env.DATABASE_URL);
};

const db = () => {
    return client.db("chat");
};

const close = () => {
    return client.close();
};

async function findMessages(sender, receiver) {
    var cursor = null;
    var result = [];
    await connectDB();
    const collection = db().collection("messages");

    cursor = collection.find({
        $or: [
            { senderID: sender.socketID, receiverID: receiver.socketID },
            { senderID: receiver.socketID, receiverID: sender.socketID },
        ],
    });

    result = await cursor.toArray();
    if (result && result.length > 0) return result;
}

async function addMessage(sender, receiver, text) {
    await connectDB();
    const collection = db().collection("messages");

    var msg = {
        senderID: sender.socketID,
        receiverID: receiver.socketID,
        sender: sender,
        receiver: receiver,
        text: text,
    };

    try {
        await collection.insertOne(msg);
    } catch (error) {
        console.log(error);
    } finally {
        return msg;
    }
}

module.exports = { findMessages, addMessage };
