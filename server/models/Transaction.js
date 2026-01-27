const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['attendance', 'quiz', 'submission', 'referral', 'reward_claim', 'admin_adjustment'],
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['completed', 'pending', 'rejected'],
        default: 'completed'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
