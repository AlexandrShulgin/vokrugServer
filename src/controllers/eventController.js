const Event = require('../models/eventModel');

const getDistance = (pointA, pointB) => {
  const latA = Number(pointA[1]) * Math.PI / 180
  const longA = Number(pointA[0]) * Math.PI / 180
  const latB = Number(pointB[1]) * Math.PI / 180
  const longB = Number(pointB[0]) * Math.PI / 180

  const cl1 = Math.cos(latA);
  const cl2 = Math.cos(latB);
  const sl1 = Math.sin(latA);
  const sl2 = Math.sin(latB);
  const delta = longA - longB;
  const cdelta = Math.cos(delta);
  const sdelta = Math.sin(delta);

  const y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
  const x = sl1 * sl2 + cl1 * cl2 * cdelta;
  const distance = Math.atan2(y, x) * 6371;
  
  return distance
}

const createEvent = async (req, res) => {
    const { type, description, coordinates, address, userId } = req.body;

    try {
        const event = new Event({
            type,
            description,
            coordinates,
            address,
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

module.exports = { createEvent, getAllEvents, getEventsInArea };