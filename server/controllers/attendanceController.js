const Attendance = require('../models/Attendance');
const User = require('../models/User');
const { syncToSheet } = require('../config/googleSheets');

// @desc    Mark attendance (Scan QR)
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if already attended today
        const existingAttendance = await Attendance.findOne({
            user: userId,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ message: 'You have already attended today' });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            user: userId,
            date: new Date(),
            method: req.body.method || 'qr'
        });

        // Add points to user
        const user = await User.findById(userId);
        user.points += 10; // +10 points for attendance
        await user.save();

        res.status(201).json({
            message: 'Attendance marked successfully',
            pointsAdded: 10,
            totalPoints: user.points
        });

        // Sync to Google Sheets
        try {
            await syncToSheet('Attendance', [{
                User: user.name,
                Email: user.email,
                Date: attendance.date.toLocaleString(),
                Method: attendance.method
            }]);
        } catch (sheetError) {
            console.error('Failed to sync attendance to Google Sheets:', sheetError);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user attendance history
// @route   GET /api/attendance
// @access  Private
const getAttendanceHistory = async (req, res) => {
    try {
        const history = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getAttendanceHistory
};
