require('dotenv').config();

const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = new User({ username, email, password });
    await user.save();
    res.status(201).send({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).send({ error: 'Username already exists' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ email: username });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).send({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
    res.send({ token });
  } catch (error) {
    res.status(500).send({ error: 'Internal server error' });
  }
});

module.exports = router;
