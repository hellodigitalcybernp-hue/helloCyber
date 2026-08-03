const express = require('express');
const router = express.Router();
const ChatConversation = require('../models/ChatConversation');
const ChatMessage = require('../models/ChatMessage');

// NOTE: mount this router behind whatever auth middleware already protects
// your other /admin routes, e.g.:
//   app.use('/admin', requireAdminAuth, adminChatRouter);

/** Inbox page: list of conversations + panel for the selected one. */
router.get('/chat', async (req, res) => {
  const conversations = await ChatConversation.find().sort({ lastMessageAt: -1 });
  res.render('admin/chat', {
    title: "Live Chat",
    conversations,
    activeConversationId: req.query.id || (conversations[0] ? conversations[0]._id : null),
  });
});

/** Polled by the admin page sidebar to catch new/updated conversations. */
router.get('/chat/list', async (req, res) => {
  const conversations = await ChatConversation.find().sort({ lastMessageAt: -1 });
  res.json({ ok: true, conversations });
});

/** Load messages for a conversation (admin side). */
router.get('/chat/:conversationId/messages', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { after } = req.query;

    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ ok: false, error: 'Conversation not found' });

    const query = { conversation: conversation._id };
    if (after) query.createdAt = { $gt: new Date(after) };

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });

    conversation.unreadByAdmin = false;
    await conversation.save();

    res.json({ ok: true, messages, conversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not load messages' });
  }
});

/** Admin sends a reply. */
router.post('/chat/:conversationId/message', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ ok: false, error: 'Message is empty' });
    }

    const conversation = await ChatConversation.findById(conversationId);
    if (!conversation) return res.status(404).json({ ok: false, error: 'Conversation not found' });

    const message = await ChatMessage.create({
      conversation: conversation._id,
      sender: 'admin',
      text: text.trim(),
    });

    conversation.lastMessageAt = new Date();
    conversation.unreadByVisitor = true;
    await conversation.save();

    res.json({ ok: true, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Could not send message' });
  }
});

/** Mark a conversation as closed. */
router.post('/chat/:conversationId/close', async (req, res) => {
  const conversation = await ChatConversation.findById(req.params.conversationId);
  if (conversation) {
    conversation.status = 'closed';
    await conversation.save();
  }
  res.json({ ok: true });
});

module.exports = router;