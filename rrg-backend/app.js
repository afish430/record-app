const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 8082;

// routes
const auth = require('./routes/api/auth');
const records = require('./routes/api/records');
const keepAliveEndpoint = 'http://localhost:' + port + '/keep-alive';

// Connect Database
connectDB();

// cors
app.use(cors({ origin: true, credentials: true }));

// Init Middleware
app.use(express.json({ extended: false }));

// use Routes
app.use('/api/auth', auth);
app.use('/api/records', records);

app.get('/keep-alive', (req, res) => {
    res.send('Server is active');
});

setInterval(() => {
axios.get(keepAliveEndpoint)
    .then(response => {
    console.log('Keep-alive request successful:', response.data);
    })
    .catch(error => {
    console.error('Error making keep-alive request:', error.message);
    });
}, 10 * 60 * 1000); // call every 10 minutes to keep API running

app.listen(port, () => console.log(`Server running on port ${port}`));