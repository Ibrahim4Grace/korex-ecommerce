const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' },
  senderModel: { type: String, required: true, enum: ['User', 'Admin'] },
  recipientId: { type: mongoose.Schema.Types.ObjectId, refPath: 'recipientModel' },
  recipientModel: { type: String, required: true, enum: ['User', 'Admin'] },
  message: { type: String,},
  senderName: { type: String, },
  senderImage: { type: String },
  time: { type: String,},
  image: { type: String },
  read: { type: Boolean, default: false },
  sender: { type: String }
});

const Message = mongoose.model('Message', messageSchema);


module.exports =  Message;