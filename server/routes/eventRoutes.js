const express = require('express');
const router = express.Router();
const { getEvents, createEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Middleware to check admin role
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

router.get('/', getEvents);
router.post('/', protect, adminOnly, createEvent);

module.exports = router;
