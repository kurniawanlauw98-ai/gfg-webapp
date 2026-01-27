const mongoose = require('mongoose');

const dailyContentSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['verse', 'quiz'],
        required: true
    },
    date: {
        type: String, // Format YYYY-MM-DD
        required: true
    },
    // For Verse
    verse: {
        text: String,
        reference: String,
        version: String
    },
    // For Quiz
    quiz: {
        question: String,
        options: [String],
        correctIndex: Number
    }
}, {
    timestamps: true
});

// Ensure only one verse/quiz per day
dailyContentSchema.index({ type: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('DailyContent', dailyContentSchema);
