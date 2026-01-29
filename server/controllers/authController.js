const { syncToSheet, getRows } = require('../config/googleSheets');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

/**
 * Helper to find user in sheet by Email
 */
const findUserInSheet = async (email) => {
    const rows = await getRows('Users');
    return rows.find(r => r.Email && r.Email.toLowerCase() === email.toLowerCase());
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

        // Check if user exists in Sheet
        const userExists = await findUserInSheet(email);
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

        const newUser = {
            ID: Date.now().toString(),
            Name: name,
            Email: email,
            Password: hashedPassword,
            Role: 'user',
            Points: '0',
            ReferralCode: newReferralCode,
            CreatedAt: new Date().toLocaleString()
        };

        await syncToSheet('Users', [newUser]);

        // Reward the referrer if code exists
        if (referralCode) {
            const allUsers = await getRows('Users');
            const referrer = allUsers.find(r => r.ReferralCode === referralCode.toUpperCase());
            if (referrer) {
                const { updateUserPoints } = require('../config/googleSheets');
                await updateUserPoints(referrer.Email, 50);
            }
        }

        res.status(201).json({
            _id: newUser.ID,
            name: newUser.Name,
            email: newUser.Email,
            token: generateToken(newUser.ID),
            role: newUser.Name === 'dede kurniawan' ? 'admin' : newUser.Role
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Special Admin Login (Bypasses Sheet for emergency)
        if (email === 'admingfg@gfg.org' && password === 'gracetoyou') {
            return res.json({
                _id: 'ADMIN_001',
                name: 'Super Admin',
                email: 'admingfg@gfg.org',
                token: generateToken('ADMIN_001'),
                role: 'admin'
            });
        }

        const userRow = await findUserInSheet(email);

        if (userRow && (await bcrypt.compare(password, userRow.Password))) {
            res.json({
                _id: userRow.ID,
                name: userRow.Name,
                email: userRow.Email,
                token: generateToken(userRow.ID),
                role: (userRow.Name === 'dede kurniawan' || userRow.Role === 'admin') ? 'admin' : 'user'
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

// @desc    Get leaderboard
// @route   GET /api/auth/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
    try {
        const rows = await getRows('Users');
        const users = rows
            .filter(r => r.Role !== 'admin')
            .map(r => ({
                name: r.Name,
                points: parseInt(r.Points) || 0,
                avatar: r.Avatar || ''
            }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 10);

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upgrade user to admin
// @route   PUT /api/auth/role
// @access  Private (Admin Only)
const upgradeToAdmin = async (req, res) => {
    try {
        const { email, role } = req.body;
        const success = await require('../config/googleSheets').updateUserRole(email, role);
        if (success) {
            res.status(200).json({ message: `User ${email} updated to ${role}` });
        } else {
            res.status(404).json({ message: 'User not found in Sheet' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getLeaderboard,
    upgradeToAdmin
};
