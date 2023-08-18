const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const sockets = require('./utils/sockets');
const db = require("./utils/db")

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000', // Change this to your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// MongoDB setup
const database = db;

// Socket.io setup
sockets.setup(io);

// API routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
