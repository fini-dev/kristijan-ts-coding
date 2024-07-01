const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');

const app = express();
const PORT = 3000;
const MONGO_URI = 'mongodb://localhost:27017/mydatabase'; // MongoDB URI

// mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
