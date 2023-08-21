const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    socketid: {type:String,unique:true},
    groups:[{type:mongoose.Schema.Types.ObjectId,ref:'Group'}]
  });

  const User = mongoose.model('User', userSchema);
  
  module.exports = User;