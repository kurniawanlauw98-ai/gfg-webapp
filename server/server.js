const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
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

// Cron Job for Daily Updates (e.g., reset daily data if needed or fetch verse)
const cron = require('node-cron');
const { getDailyVerse } = require('./controllers/dailyController'); // We might expose a helper or just rely on lazy fetch
// Running at midnight (00:00) Jakarta time (if server is UTC, adjust accordingly)
// For now, let's just log it. Real Verse is fetched lazily on first request of the day in logic above.
cron.schedule('0 0 * * *', () => {
    console.log('Running daily maintenance tasks...');
    // Could trigger verse fetch here to cache it
});

// Socket.io Setup (Only for Local/Stateful server)
if (process.env.NODE_ENV !== 'production') {
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
    // For Vercel Serverless
    module.exports = app;
}

