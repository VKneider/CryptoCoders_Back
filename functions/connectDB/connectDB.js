const { MongoClient } = require("mongodb");

async function connectDB() {
    const client = new MongoClient('mongodb+srv://cryptocoders:cryptocoders@cluster0.o2sbqjl.mongodb.net/?retryWrites=true&w=majority');
    await client.connect();
    return client;
}

module.exports = connectDB; 