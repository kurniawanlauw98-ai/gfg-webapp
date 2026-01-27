const User = require('../models/User');
const Transaction = require('../models/Transaction'); // Import Transaction
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, referralCode } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate own referral code (simple random string)
        const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        // Check for referrer
        let referrerId = null;
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer) {
                referrerId = referrer._id;
                // Add points to referrer (+200)
                referrer.points += 200;
                await referrer.save();
                // Create transaction record for referrer
                await Transaction.create({
                    user: referrerId,
                    amount: 200,
                    type: 'referral',
                    description: `Referral bonus for inviting ${name}`
                });
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            referralCode: newReferralCode,
            referredBy: referrerId
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: generateToken(user._id),
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            message: 'Server error during registration',
            error: error.message
        });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
            role: user.role
        });
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is set by authMiddleware
    res.status(200).json(req.user);
};

// @desc    Get leaderboard
// @route   GET /api/auth/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }) // Filter admin out if needed, or include all
            .sort({ points: -1 })
            .limit(10)
            .select('name points avatar');

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getLeaderboard
};
