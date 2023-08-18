const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');
const sockets = require('./config/sockets');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB setup
mongoose.connect(process.env.MONGODB_URL, {
  dbName: "chat-app",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Socket.io setup
sockets.setup(io);

// API routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
