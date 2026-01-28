const { syncToSheet, getRows, updateUserPoints } = require('../config/googleSheets');

// @desc    Create a new submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = async (req, res) => {
    const { type, content } = req.body;

    if (!type || !content) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const submissionId = Date.now().toString();
        const dateString = new Date().toLocaleString();

        const submission = {
            ID: submissionId,
            User: req.user.name,
            Email: req.user.email,
            Type: type,
            Content: content,
            Date: dateString
        };

        // Add points for submission
        await updateUserPoints(req.user.email, 15);

        // Sync to Google Sheets
        await syncToSheet('Submissions', [submission]);

        res.status(201).json({
            message: 'Submission successful',
            pointsAdded: 15,
            totalPoints: (req.user.points || 0) + 15,
            submission
        });

    } catch (error) {
        console.error('Submission Error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all submissions (Admin)
// @route   GET /api/submissions
// @access  Private/Admin
const getSubmissions = async (req, res) => {
    try {
        const rows = await getRows('Submissions');
        const submissions = rows.map(r => ({
            _id: r.ID,
            type: r.Type,
            content: r.Content,
            createdAt: r.Date,
            user: {
                name: r.User,
                email: r.Email
            }
        })).reverse();

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createSubmission,
    getSubmissions
};
