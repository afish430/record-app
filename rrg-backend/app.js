const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 8082;

// routes
const auth = require('./routes/api/auth');
const records = require('./routes/api/records');

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

// use Routes
app.use('/api/auth', auth);
app.use('/api/records', records);

app.get('/api/keep-alive', (req, res) => {
    res.send('Staying alive...');
});

setInterval(() => {
axios.get('https://vinylator-api.onrender.com/api/keep-alive')
    .then(response => {
    console.log('Keep-alive request successful:', response.data);
    })
    .catch(error => {
    console.error('Error making keep-alive request:', error.message);
    });
}, 3 * 60 * 1000); // call every 3 minutes to keep API running

app.listen(port, () => console.log(`Server running on port ${port}`));