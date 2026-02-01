const { syncToSheet, getRows, updateUserResetToken, updatePasswordByEmail } = require('../config/googleSheets');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

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
    return rows.find(r => {
        const rowEmail = r.Email || r.email || '';
        return rowEmail.toLowerCase() === email.toLowerCase();
    });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, referralCode, dob, hobby, favoriteVerse } = req.body;

        if (!name || !email || !password || !dob) {
            return res.status(400).json({ message: 'Please add all required fields (Name, Email, Password, Birthday)' });
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
            DOB: dob,
            Hobby: hobby,
            FavoriteVerse: favoriteVerse,
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
    try {
        // Fetch fresh data from sheet
        const userRow = await findUserInSheet(req.user.email);

        if (userRow) {
            // Robust point parsing
            const rawPoints = userRow.Points || userRow.points || '0';
            const parsedPoints = parseInt(rawPoints) || 0;

            const freshUser = {
                id: userRow.ID,
                name: userRow.Name,
                email: userRow.Email,
                role: (userRow.Name === 'dede kurniawan' || userRow.Role === 'admin') ? 'admin' : 'user',
                points: parsedPoints,
                referralCode: userRow.ReferralCode,
                dob: userRow.DOB,
                hobby: userRow.Hobby,
                favoriteVerse: userRow.FavoriteVerse
            };

            console.log(`[getMe] Fetched fresh points for ${freshUser.email}: ${parsedPoints}`);
            res.status(200).json(freshUser);
        } else {
            // Fallback to token data if sheet fails
            res.status(200).json(req.user);
        }
    } catch (error) {
        console.error("Error fetching fresh user data:", error);
        res.status(200).json(req.user);
    }
};

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const rows = await getRows('Users');
        const users = rows.map(r => ({
            id: r.ID,
            name: r.Name,
            email: r.Email,
            role: r.Role,
            points: parseInt(r.Points) || 0,
            dob: r.DOB,
            hobby: r.Hobby,
            favoriteVerse: r.FavoriteVerse,
            createdAt: r.CreatedAt
        }));
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
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

// @desc    Forgot Password - Send OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const userRow = await findUserInSheet(email);
        if (!userRow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = Date.now() + 3600000; // 1 hour

        await updateUserResetToken(email, otp, expires.toString());

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"GFG Community" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Verification Code',
            text: `Your verification code is: ${otp}. It will expire in 1 hour.`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #2563eb; text-align: center;">GFG Generation for God</h2>
                    <p>Hello,</p>
                    <p>You requested to reset your password. Use the verification code below to proceed:</p>
                    <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1e40af; border-radius: 8px; margin: 20px 0;">
                        ${otp}
                    </div>
                    <p>This code will expire in 1 hour. If you didn't request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #666; text-align: center;">© 2026 GFG Platform • Empowered by Faith</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Verification code sent to email' });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Failed to send verification email' });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const userRow = await findUserInSheet(email);
        if (!userRow) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if OTP matches and hasn't expired
        if (userRow.ResetToken !== otp || Date.now() > parseInt(userRow.ResetExpires)) {
            return res.status(400).json({ message: 'Invalid or expired verification code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        const success = await updatePasswordByEmail(email, hashedPassword);
        if (success) {
            res.status(200).json({ message: 'Password reset successful!' });
        } else {
            res.status(500).json({ message: 'Failed to update password' });
        }
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error during password reset' });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
    getLeaderboard,
    upgradeToAdmin,
    getUsers,
    forgotPassword,
    resetPassword
};
