const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');

/**
 * Start or resume a conversation for a visitor.
 * Called once when the widget is first opened. If the browser already has a
 * visitorId in localStorage it is reused, so refreshing the page keeps the
 * same conversation.
 */
router.post('/chat/start', async (req, res) => {
  try {
    let { visitorId, name, phone } = req.body;

    if (!visitorId) {
      visitorId = crypto.randomBytes(16).toString('hex');
    }

    let conversation = await ChatConversation.findOne({ visitorId });

    if (!conversation) {
      conversation = await ChatConversation.create({
        visitorId,
        visitorName: name || 'Visitor',
        visitorPhone: phone || '',
      });
    } else if (name || phone) {
      if (name) conversation.visitorName = name;
      if (phone) conversation.visitorPhone = phone;
      await conversation.save();
    }

    res.json({ ok: true, visitorId, conversationId: conversation._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not start chat' });
  }
});

/** Visitor sends a message. */
router.post('/chat/:conversationId/message', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text, visitorId } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ ok: false, error: 'Message is empty' });
    }

    const conversation = await ChatConversation.findOne({ _id: conversationId, visitorId });
    if (!conversation) return res.status(404).json({ ok: false, error: 'Conversation not found' });

    const message = await ChatMessage.create({
      conversation: conversation._id,
      sender: 'visitor',
      text: text.trim(),
    });

    conversation.lastMessageAt = new Date();
    conversation.unreadByAdmin = true;
    conversation.status = 'open';
    await conversation.save();

    res.json({ ok: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not send message' });
  }
});

/** Visitor polls for new messages (called every few seconds by the widget). */
router.get('/chat/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { visitorId, after } = req.query;

    const conversation = await ChatConversation.findOne({ _id: conversationId, visitorId });
    if (!conversation) return res.status(404).json({ ok: false, error: 'Conversation not found' });

    const query = { conversation: conversation._id };
    if (after) query.createdAt = { $gt: new Date(after) };

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });

    conversation.unreadByVisitor = false;
    await conversation.save();

    res.json({ ok: true, messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not load messages' });
  }
});

module.exports = router;
