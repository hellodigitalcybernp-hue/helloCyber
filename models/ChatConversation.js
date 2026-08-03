const mongoose = require('mongoose');

const chatConversationSchema = new mongoose.Schema(
  {
    // Random id generated client-side and stored in localStorage so an
    // anonymous visitor can be recognized across page loads/visits.
    visitorId: { type: String, required: true, unique: true, index: true },
    visitorName: { type: String, default: 'Visitor' },
    visitorPhone: { type: String, default: '' },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    lastMessageAt: { type: Date, default: Date.now },
    unreadByAdmin: { type: Boolean, default: false },
    unreadByVisitor: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatConversation', chatConversationSchema);
