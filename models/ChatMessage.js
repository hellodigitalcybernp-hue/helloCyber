const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ChatConversation',
      required: true,
      index: true,
    },
    sender: { type: String, enum: ['visitor', 'admin'], required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
