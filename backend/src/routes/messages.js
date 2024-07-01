require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const Message = require('../models/Message');
const User = require('../models/User');

const router = express.Router();

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'].split(' ')[1];  
  if (!token) return res.sendStatus(403);

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Create a message
router.post('/message', authenticateToken, async (req, res) => {
  const { message } = req.body;
  try {
    const messageObj = new Message({ userId: req.user.userId, message });
    await messageObj.save();
    res.status(201).send(messageObj);
  } catch (error) {    
    res.status(400).send({ error: 'Failed to create message' });
  }
});

// List messages
router.get('/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.user.userId }).populate('userId', 'username');
    res.send(messages);
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
