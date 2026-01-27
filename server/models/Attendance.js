const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    method: {
        type: String,
        enum: ['qr', 'code'],
        default: 'qr'
    }
}, {
    timestamps: true
});

// Compound index to ensure one attendance per user per day logic is easily queryable,
// though manual check is better for complete day range (00:00 - 23:59)
// attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
