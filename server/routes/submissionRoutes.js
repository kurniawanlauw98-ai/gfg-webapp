const express = require('express');
const router = express.Router();
const { createSubmission, getSubmissions } = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

router.post('/', protect, createSubmission);
router.get('/', protect, adminOnly, getSubmissions);

module.exports = router;
