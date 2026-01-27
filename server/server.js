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

// Production Mode (Vercel Serverless): Ensure DB connection on every request
app.use(async (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        try {
            await connectDB();
            next();
        } catch (err) {
            console.error('Database connection error:', err);
            return res.status(500).json({
                message: 'Database connection failed',
                error: err.message,
                stack: err.stack,
                uriUsed: process.env.MONGO_URI ? (process.env.MONGO_URI.substring(0, 30) + '...') : 'NULL/MISSING'
            });
        }
    } else {
        next();
    }
});

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
}

// Development Mode: Socket.io, Cron, and Server Listening

// Export app for Vercel Serverless
module.exports = app;

