const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const dbURI = process.env.MONGODB_URL; 

mongoose.connect(dbURI, {
  dbName: "chat-app",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

db.on('disconnected', () => {
  console.log('Disconnected from MongoDB');
});

module.exports = db;
