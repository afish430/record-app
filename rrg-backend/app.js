const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
require('dotenv').config();

// routes
const auth = require('./routes/api/auth');
const records = require('./routes/api/records');
const app = express();

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

// use Routes
app.use('/api/auth', auth);
app.use('/api/records', records);

const port = 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));