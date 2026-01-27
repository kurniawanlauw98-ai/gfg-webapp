const express = require('express');
const router = express.Router();
const { markAttendance, getAttendanceHistory } = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, markAttendance);
router.get('/', protect, getAttendanceHistory);

module.exports = router;
