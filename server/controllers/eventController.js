const { syncToSheet, getRows } = require('../config/googleSheets');

// @desc    Get all upcoming events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
    try {
        const rows = await getRows('Events');
        const now = new Date();
        const events = rows
            .map(r => ({
                id: r.ID,
                title: r.Title,
                date: r.Date,
                location: r.Location,
                description: r.Description
            }))
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

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
        const eventId = Date.now().toString();
        const event = {
            ID: eventId,
            Title: title,
            Date: date,
            Location: location,
            Description: description,
            CreatedBy: req.user.name
        };

        await syncToSheet('Events', [event]);

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEvents,
    createEvent
};
