// backend/db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI);

async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    // console.log("MONGO_URI:", process.env.MONGO_URI);

  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

module.exports = { client, connectToMongo };
