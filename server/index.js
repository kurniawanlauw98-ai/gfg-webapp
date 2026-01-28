console.log("Vercel Function Initializing...");

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Diagnostic logging
console.log("Environment check:", {
    NODE_ENV: process.env.NODE_ENV,
    HAS_SHEETS_ID: !!process.env.GOOGLE_SHEETS_ID
});

// Minimal Routes
app.get('/api/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        status: 'online'
    });
});

app.get('/', (req, res) => {
    res.send('GFG Backend is Online (Minimal Mode)');
});

module.exports = app;
