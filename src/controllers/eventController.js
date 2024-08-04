const Event = require('../models/eventModel');
const turf = require('@turf/turf')

const getDistance = (pointA, pointB) => {
  const distance = turf.distance(pointA, pointB, {units: "kilometers"})
  return distance
}

const createEvent = async (req, res) => {
    const { type, description, coordinates, address, userId, name } = req.body;

    try {
        const event = new Event({
            type,
            description,
            coordinates,
            address,
            userId,
            name,
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

const getEventsInArea = async (req, res) => {
  const { searchCenter, searchRadius } = req.query
  try {
    const events = await Event.find()
    const filteredEvents = events.filter((event) => getDistance(event.coordinates, searchCenter) < searchRadius)
    res.status(200).json(filteredEvents)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const getEventById = async (req, res) => {
  const { id } = req.query
  try {
    const event = await Event.findById({_id: id})
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const plusEvent = async (req, res) => {
  const {eventId, userId} = req.body
  try {
    const event = await Event.findByIdAndUpdate({_id: eventId}, {$push: {'pluses': userId}})
    await event.save()
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

const reportEvent = async (req, res) => {
  const {eventId, userId} = req.body
  try {
    const event = await Event.findByIdAndUpdate({_id: eventId}, {$push: {'reports': userId}})
    await event.save()
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

module.exports = { createEvent, getAllEvents, getEventsInArea, getEventById, plusEvent, reportEvent };