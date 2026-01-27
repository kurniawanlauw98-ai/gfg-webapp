const express = require('express');
const router = express.Router();
const { getDailyVerse, getDailyQuiz, submitQuiz, createDailyQuiz } = require('../controllers/dailyController');
const { protect } = require('../middleware/authMiddleware');

const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as admin' });
    }
};

router.get('/verse', getDailyVerse);
router.get('/quiz', getDailyQuiz);
router.post('/quiz/submit', protect, submitQuiz);
router.post('/quiz', protect, adminOnly, createDailyQuiz);

module.exports = router;
