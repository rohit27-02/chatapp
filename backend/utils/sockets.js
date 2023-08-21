const { MemoryStore } = require('express-session');
const Message = require('../models/message');
const jwtUtils = require("./jwtUtils")
const uuid = require('uuid');
const { InMemorySessionStore } = require("./sessionStore");
const sessionStore = new InMemorySessionStore();

module.exports = {
  setup: (io) => {
    io.use((socket, next) => {
      const sessionID = socket.handshake.auth.sessionID;
      if (sessionID) {
        const session = sessionStore.findSession(sessionID);
        if (session) {
          socket.sessionID = sessionID;
          socket.userID = session.userID;
          socket.username = session.username;
          return next();
        }
      }
      const username = socket.handshake.auth.username;
      if (!username) {
        return next(new Error("invalid username"));
      }
      socket.sessionID = uuid.v4();
      socket.userID = uuid.v4();
      socket.username = username;
      next();
    });

    io.on('connection', (socket) => {
      // persist session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        username: socket.username,
        connected: true,
      });

      // emit session details
      socket.emit("session", {
        sessionID: socket.sessionID,
        userID: socket.userID,
      });

      // join the "userID" room
      socket.join(socket.userID);

      // fetch existing users
      const users = [];
      sessionStore.findAllSessions().forEach((session) => {
        users.push({
          userID: session.userID,
          username: session.username,
          connected: session.connected,
        });
      });
      socket.emit("users", users);

      // notify existing users
      socket.broadcast.emit("user connected", {
        userID: socket.userID,
        username: socket.username,
        connected: true,
      });

      // forward the private message to the right recipient (and to other tabs of the sender)
      socket.on("private message", ({ content, to }) => {
        socket.to(to).to(socket.userID).emit("private message", {
          content,
          from: socket.userID,
          to,
        });
      });

      // notify users upon disconnection
      socket.on("disconnect", async () => {
        const matchingSockets = await io.in(socket.userID).allSockets();
        const isDisconnected = matchingSockets.size === 0;
        if (isDisconnected) {
          // notify other users
          socket.broadcast.emit("user disconnected", socket.userID);
          // update the connection status of the session
          sessionStore.saveSession(socket.sessionID, {
            userID: socket.userID,
            username: socket.username,
            connected: false,
          });
        }
      });

      socket.on('chat message', async ({ message, token }) => {
        console.log("Received chat message:", message, se);

        try {
          const id = jwtUtils.verifyToken(token);
          console.log("User ID from token:", id.userId);

          const newMessage = new Message({ text: message, sender: id.userId });
          await newMessage.save();
          console.log("Message saved to the database:", newMessage);

          io.emit('chat message', newMessage);
          console.log("Message emitted to all clients.");
        } catch (error) {
          console.error("Error:", error);
        }
      });

    })
  }
};
