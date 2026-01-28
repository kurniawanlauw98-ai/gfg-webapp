const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

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

app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        mode: 'Google Sheets DB (Standard)',
        env: {
            node_env: process.env.NODE_ENV,
            sheets_id_exists: !!process.env.GOOGLE_SHEETS_ID,
            mongo_uri_exists: !!process.env.MONGO_URI
        }
    });
});

// Production Mode: Optional DB connection
app.use(async (req, res, next) => {
    if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI) {
        connectDB().catch(err => console.log('DB connection failed in background:', err.message));
    }
    next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
// app.use('/api/events', require('./routes/eventRoutes'));
// app.use('/api/attendance', require('./routes/attendanceRoutes'));
// app.use('/api/daily', require('./routes/dailyRoutes'));
// app.use('/api/submissions', require('./routes/submissionRoutes'));

// Basic Route
app.get('/', (req, res) => {
    res.send('GFG Generation for God API is running (Sheets Mode)');
});

// Development Mode Server
if (process.env.NODE_ENV !== 'production') {
    connectDB().catch(err => console.log('Local DB connection failed:', err.message));

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
