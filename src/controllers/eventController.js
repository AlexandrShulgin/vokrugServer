const Event = require('../models/eventModel');

const createEvent = async (req, res) => {
    const { type, description, coordinates, userId } = req.body;

    try {
        const event = new Event({
            type,
            description,
            coordinates,
            userId
        });

        await event.save();
        res.status(201).json({ message: 'Event' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

const getAllEvents = async (req, res) => {
  try {
      const events = await Event.find();
      res.status(200).json(events);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

module.exports = { createEvent, getAllEvents };