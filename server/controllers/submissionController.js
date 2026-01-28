const Submission = require('../models/Submission');
const User = require('../models/User');
const { syncToSheet } = require('../config/googleSheets');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = async (req, res) => {
    const { type, content } = req.body;

    if (!type || !content) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const submission = await Submission.create({
            user: req.user.id,
            type,
            content
        });

        // Add points for submission
        const user = await User.findById(req.user.id);
        user.points += 15;
        await user.save();

        res.status(201).json({
            message: 'Submission successful',
            pointsAdded: 15,
            totalPoints: user.points,
            submission
        });

        // Sync to Google Sheets
        try {
            await syncToSheet('Submissions', [{
                ID: submission._id.toString(),
                User: user.name,
                Email: user.email,
                Type: type,
                Content: content,
                Date: submission.createdAt.toISOString()
            }]);
        } catch (sheetError) {
            console.error('Failed to sync to Google Sheets:', sheetError);
            // We don't want to fail the whole request if sheet sync fails
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all submissions (Admin)
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
    try {
        const submissions = await Submission.find().populate('user', 'name email').sort({ createdAt: -1 });
        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubmission,
    getSubmissions
};
