const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Diagnostic Route
app.get('/api/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        status: 'online',
        mode: 'Google Sheets DB'
    });
});

app.get('/api/health', async (req, res) => {
    const { testConnection } = require('./config/googleSheets');
    const sheetsStatus = await testConnection();

    res.json({
        status: 'online',
        mode: 'Google Sheets DB (Standard)',
        sheets_connection: sheetsStatus,
        env: {
            node_env: process.env.NODE_ENV,
            sheets_id_exists: !!process.env.GOOGLE_SHEETS_ID,
            sheets_email_exists: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            sheets_key_exists: !!process.env.GOOGLE_PRIVATE_KEY,
            jwt_secret_exists: !!process.env.JWT_SECRET
        }
    });
});

// Production Mode: Google Sheets Only
app.use(async (req, res, next) => {
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/daily', require('./routes/dailyRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('GFG Generation for God API is running (Sheets Mode)');
});

// Development Mode Server
if (process.env.NODE_ENV !== 'production') {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    const io = require('socket.io')(server, {
        cors: { origin: "*", methods: ["GET", "POST"] }
    });

    io.on('connection', (socket) => {
        socket.on('join_room', (room) => socket.join(room));
        socket.on('send_message', (data) => io.to(data.room).emit('receive_message', data));
    });
}

// Export app for Vercel
module.exports = app;
