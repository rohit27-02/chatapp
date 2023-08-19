const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  messages:[{type: mongoose.Schema.Types.ObjectId, ref: 'Message'}],
  users:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
