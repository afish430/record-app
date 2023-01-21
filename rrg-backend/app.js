const express = require('express');
const connectDB = require('./config/db');
var cors = require('cors');

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

const port = process.env.PORT || 8082;
app.listen(port, () => console.log(`Server running on port ${port}`));