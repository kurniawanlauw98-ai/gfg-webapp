const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, getLeaderboard } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.get('/leaderboard', getLeaderboard);
router.get('/status', (req, res) => {
    res.json({
        status: 'online',
        env: {
            node_env: process.env.NODE_ENV,
            mongo_uri_exists: !!process.env.MONGO_URI,
            mongo_uri_prefix: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 15) : 'none',
            jwt_secret_exists: !!process.env.JWT_SECRET
        }
    });
});

module.exports = router;
