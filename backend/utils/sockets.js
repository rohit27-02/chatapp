const Message = require('../models/message');

module.exports = {
  setup: (io) => {
    io.on('connection', (socket) => {
      console.log('User connected');

      socket.on('chat message', async (message) => {
        // Save the message to the database
        const newMessage = new Message({ text: message });
        await newMessage.save();

        // Emit the message to all clients
        io.emit('chat message', newMessage);
      });

      socket.on('disconnect', () => {
        console.log('User disconnected');
      });
    });
  },
};
