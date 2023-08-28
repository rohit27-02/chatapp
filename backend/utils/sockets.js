const jwtUtils = require("./jwtUtils")
const { Postchat } = require('../middleware/chat');

const userSocketMap = new Map(); // Map userId to socketId

module.exports = {
  setup: (io) => {
    io.on('connection', (socket) => {
      const socketId = socket.id;
      const token = socket.handshake.auth.token;
      const id = jwtUtils.verifyToken(token);
      socket.userID = id.userId;
      userSocketMap.set(socket.userID, socketId);

      // forward the private message to the right recipient (and to other tabs of the sender)
      socket.on("private message", ({ content, to }) => {
        socket.to([socket.id,userSocketMap.get(to)]).emit("private message", {
          content,
          from: socket.userID,
          to,
        });

        Postchat({ userId: to, currentUser: socket.userID, message: content });
      });
    });
  }
};
