const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Absolute Minimal Routes
app.get('/api/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        env_check: {
            node_env: process.env.NODE_ENV,
            has_sheets_id: !!process.env.GOOGLE_SHEETS_ID
        }
    });
});

app.get('/', (req, res) => {
    res.send('GFG Minimal API Test');
});

module.exports = app;
