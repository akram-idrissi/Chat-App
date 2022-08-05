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

async function addUser(socketID, name, image) {
    await connectDB();
    const collection = db().collection("users");

    let user = {
        socketID: socketID,
        name: name,
        image: image,
    };

    try {
        await collection.insertOne(user);
    } catch (error) {
        console.log(error);
    } finally {
        return user;
    }
}

module.exports = { addUser };

/* const User = require("./../models/user.js");

async function findUsers() {
    try {
        return await User.find();
    } catch (error) {
        console.error(error);
    }
}

async function addUser(socketID, name, image) {
    let user = new User({
        socketID: socketID,
        name: name,
        image: image,
    });

    try {
        user = await user.save();
        return user;
    } catch (error) {
        console.error(error);
    }
}

async function deleteUser(id) {
    await User.findByIdAndDelete(id);
}

module.exports = { findUsers, addUser, deleteUser };
 */
