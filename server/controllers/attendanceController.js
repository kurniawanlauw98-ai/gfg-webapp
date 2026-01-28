const { syncToSheet, getRows, updateUserPoints } = require('../config/googleSheets');

// @desc    Mark attendance (Scan QR)
// @route   POST /api/attendance
// @access  Private
const markAttendance = async (req, res) => {
    try {
        const userId = req.user.id;
        const userEmail = req.user.email;
        const userName = req.user.name;

        const todayPrefix = new Date().toLocaleDateString();

        // Check if already attended today (in Sheet)
        const rows = await getRows('Attendance');
        const existingAttendance = rows.find(r =>
            r.Email === userEmail &&
            r.Date && r.Date.startsWith(todayPrefix)
        );

        if (existingAttendance) {
            return res.status(400).json({ message: 'You have already attended today' });
        }

        const dateString = new Date().toLocaleString();
        const method = req.body.method || 'qr';

        // Add points to user in Sheet
        await updateUserPoints(userEmail, 10);

        // Sync to Google Sheets
        await syncToSheet('Attendance', [{
            User: userName,
            Email: userEmail,
            Date: dateString,
            Method: method
        }]);

        res.status(201).json({
            message: 'Attendance marked successfully',
            pointsAdded: 10,
            totalPoints: (req.user.points || 0) + 10
        });

    } catch (error) {
        console.error('Attendance Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user attendance history
// @route   GET /api/attendance
// @access  Private
const getAttendanceHistory = async (req, res) => {
    try {
        const rows = await getRows('Attendance');
        const history = rows
            .filter(r => r.Email === req.user.email)
            .map(r => ({
                date: r.Date,
                method: r.Method
            }))
            .reverse();

        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    markAttendance,
    getAttendanceHistory
};
