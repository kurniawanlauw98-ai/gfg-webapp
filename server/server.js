const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Basic Route
app.get('/', (req, res) => {
    res.send('GFG Generation for God API is running');
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/daily', require('./routes/dailyRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Development Mode: Socket.io, Cron, and Server Listening
if (process.env.NODE_ENV !== 'production') {
    // Connect to Database
    connectDB();

    // Cron Job for Daily Updates
    const cron = require('node-cron');
    cron.schedule('0 0 * * *', () => {
        console.log('Running daily maintenance tasks...');
    });

    // Start server with Socket.io
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    const io = require('socket.io')(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join_room', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        socket.on('send_message', (data) => {
            io.to(data.room).emit('receive_message', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });
} else {
    // Production Mode (Vercel Serverless): Connect DB on cold starts
    connectDB().catch(err => {
        console.error('MongoDB connection failed:', err);
    });
}

// Export app for Vercel Serverless
module.exports = app;

