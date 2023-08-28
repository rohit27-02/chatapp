const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Storing user references as friends
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  chatHistory: [{
    withUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User',unique: false,}, // Storing user references for chat history
    messages: [{
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }]
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
