const Event = require('../models/Event');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ date: { $gte: new Date() } }).sort({ date: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
const createEvent = async (req, res) => {
    const { title, date, location, description } = req.body;

    if (!title || !date || !location) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const event = await Event.create({
            title,
            date,
            location,
            description,
            createdBy: req.user.id
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    createEvent
};
