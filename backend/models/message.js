const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  // ... other fields
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
