const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const sockets = require('./utils/sockets');
const db = require("./utils/db")
const authRoutes = require("./routes/auth");
const adminRoutes = require('./routes/admin');
const register = require("./routes/register");
const login = require("./routes/login");

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
app.use('/auth',authRoutes);
app.use('/admin',adminRoutes);
app.use('/api',register);
app.use('/api',login);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
