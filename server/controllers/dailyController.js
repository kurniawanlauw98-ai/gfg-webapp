const { getRows } = require('../config/googleSheets');

// Helper: Get today's date string YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

// @desc    Get Daily Verse (Auto-fetch via API)
// @route   GET /api/daily/verse
// @access  Public
const getDailyVerse = async (req, res) => {
    try {
        const response = await fetch('https://bible-api.com/?random=verse');
        const data = await response.json();

        res.status(200).json({
            type: 'verse',
            date: getTodayString(),
            verse: {
                text: data.text,
                reference: data.reference,
                version: data.translation_name || 'WEB'
            }
        });
    } catch (error) {
        console.error('Verse Fetch Error:', error);
        res.status(500).json({ message: 'Daily verse unavailable temporarily' });
    }
};

// @desc    Get Daily Quiz (From Sheet)
// @route   GET /api/daily/quiz
// @access  Public
const getDailyQuiz = async (req, res) => {
    try {
        const today = getTodayString();
        const rows = await getRows('Quizzes');
        const quizRow = rows.find(r => r.Date === today);

        if (!quizRow) {
            return res.status(404).json({ message: 'No quiz available for today' });
        }

        res.status(200).json({
            type: 'quiz',
            date: today,
            quiz: {
                question: quizRow.Question,
                options: (quizRow.Options || '').split('|')
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit Daily Quiz
// @route   POST /api/daily/quiz/submit
// @access  Private
const submitQuiz = async (req, res) => {
    const { answerIndex } = req.body;
    const userId = req.user.id;
    const today = getTodayString();

    try {
        const rows = await getRows('Quizzes');
        const quizRow = rows.find(r => r.Date === today);

        if (!quizRow) {
            return res.status(404).json({ message: 'No quiz for today' });
        }

        if (parseInt(answerIndex) === parseInt(quizRow.CorrectIndex)) {
            const { updateUserPoints } = require('../config/googleSheets');
            await updateUserPoints(req.user.email, 20);
            return res.status(200).json({ message: 'Correct!', pointsAdded: 20, correct: true });
        } else {
            return res.status(200).json({ message: 'Incorrect', pointsAdded: 0, correct: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDailyVerse,
    getDailyQuiz,
    submitQuiz
};
