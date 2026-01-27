const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['prayer', 'testimony', 'idea'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false // Check later if we want public wall
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
