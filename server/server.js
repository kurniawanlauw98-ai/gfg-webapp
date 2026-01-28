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

// Diagnostic Route (Bypasses DB middleware)
app.get('/api/health', async (req, res) => {
    let dbStatus = 'disconnected';
    let dbError = null;

    try {
        await connectDB();
        dbStatus = 'connected';
    } catch (err) {
        dbStatus = 'failed';
        dbError = err.message;
    }

    res.json({
        status: 'online',
        database: dbStatus,
        mode: 'Google Sheets DB (Standard)',
        error: dbError,
        env: {
            node_env: process.env.NODE_ENV,
            mongo_uri_exists: !!process.env.MONGO_URI,
            sheets_id_exists: !!process.env.GOOGLE_SHEETS_ID
        }
    });
});

// Emergency Seed Route - Disabled or converted? 
// We'll keep it but it's less relevant now as Admin bypass is in authController.
app.get('/api/seed-admin', async (req, res) => {
    res.json({ message: 'MongoDB Seeding bypassed. Use Google Sheets for user management.' });
});

// Production Mode: We NO LONGER block on MongoDB failure
app.use(async (req, res, next) => {
    // Optional DB connection - don't await or catch failure
    if (process.env.NODE_ENV === 'production' && process.env.MONGO_URI) {
        connectDB().catch(err => console.log('DB connection failed in background:', err.message));
    }
    next();
});

// Basic Route
app.get('/', (req, res) => {
    res.send('GFG Generation for God API is running (Sheets Mode)');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/daily', require('./routes/dailyRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Development Mode: Socket.io, Cron, and Server Listening
if (process.env.NODE_ENV !== 'production') {
    connectDB().catch(err => console.log('Local DB connection failed:', err.message));

    const cron = require('node-cron');
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily maintenance tasks...');
    });

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
} else {
    // Export app for Vercel Serverless
    module.exports = app;
}
