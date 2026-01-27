const DailyContent = require('../models/DailyContent');
const User = require('../models/User');
const axios = require('axios'); // Need to install axios if not present, or use fetch if node 18+

// Helper: Get today's date string YYYY-MM-DD
const getTodayString = () => new Date().toISOString().split('T')[0];

// @desc    Get Daily Verse (Auto-fetch if missing)
// @route   GET /api/daily/verse
// @access  Public
const getDailyVerse = async (req, res) => {
    try {
        const today = getTodayString();
        let content = await DailyContent.findOne({ type: 'verse', date: today });

        if (!content) {
            // Fetch from external API
            try {
                // Using bible-api.com as example
                // const response = await axios.get('https://bible-api.com/?random=verse');
                // For reliability ensuring we get valid JSON, defaulting to a specific verse if API fails or for safety
                // In real app, trust the API.
                const response = await fetch('https://bible-api.com/?random=verse');
                const data = await response.json();

                content = await DailyContent.create({
                    type: 'verse',
                    date: today,
                    verse: {
                        text: data.text,
                        reference: data.reference,
                        version: data.translation_name || 'WEB'
                    }
                });
            } catch (err) {
                console.error('Error fetching verse:', err);
                return res.status(503).json({ message: 'Daily verse unavailable temporarily' });
            }
        }
        res.status(200).json(content);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get Daily Quiz
// @route   GET /api/daily/quiz
// @access  Public
const getDailyQuiz = async (req, res) => {
    try {
        const today = getTodayString();
        const content = await DailyContent.findOne({ type: 'quiz', date: today });

        if (!content) {
            return res.status(404).json({ message: 'No quiz available for today yet' });
        }

        // Hide correct answer
        const quizData = content.toObject();
        delete quizData.quiz.correctIndex;

        res.status(200).json(quizData);
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
        const content = await DailyContent.findOne({ type: 'quiz', date: today });
        if (!content) {
            return res.status(404).json({ message: 'No quiz for today' });
        }

        // Check if user already answered today
        // Ideally we need a separate collection for UserQuizAttempts to track this specifically.
        // For simplicity, checking if they have a 'quiz' transaction for today.
        // But let's assume we allow retries or just check the Transaction log.
        // Use Transaction log approach for MVP.
        const Transaction = require('../models/Transaction'); // We haven't created this yet but will need it.
        // For now, let's just use User model points or a temp check.
        // TODO: Strict one-time check.

        if (answerIndex === content.quiz.correctIndex) {
            const user = await User.findById(userId);
            user.points += 20;
            await user.save();
            return res.status(200).json({ message: 'Correct!', pointsAdded: 20, correct: true });
        } else {
            return res.status(200).json({ message: 'Incorrect', pointsAdded: 0, correct: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create Daily Quiz (Admin)
// @route   POST /api/daily/quiz
// @access  Private/Admin
const createDailyQuiz = async (req, res) => {
    const { question, options, correctIndex, date } = req.body;
    const quizDate = date || getTodayString();

    try {
        const content = await DailyContent.create({
            type: 'quiz',
            date: quizDate,
            quiz: {
                question,
                options,
                correctIndex
            }
        });
        res.status(201).json(content);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getDailyVerse,
    getDailyQuiz,
    submitQuiz,
    createDailyQuiz
};
