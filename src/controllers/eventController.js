const multer = require('multer');
const path = require('path');
const Event = require('../models/eventModel');
const turf = require('@turf/turf');
const Media = require('../models/mediaModel');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
  fileFilter: function (req, file, cb) {

      const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
          return cb(null, true);
      } else {
          cb(new Error('Only images and videos are allowed!'));
      }
  }
});

const getDistance = (pointA, pointB) => {
  const distance = turf.distance(pointA, pointB, { units: 'kilometers' });
  return distance;
};

const createEvent = async (req, res) => {
    const { type, description, coordinates, address, userId, name } = req.body;
    const myMedia = req.files ? req.files.map(file => file.path) : [];
    try {
        const event = new Event({
            type,
            description,
            coordinates: JSON.parse(coordinates),
            address: JSON.parse(address),
            userId,
            name,
        });
        const media = new Media({
            event: event._id,
            media: myMedia
        })
        await event.save();
        await media.save();
        res.status(201).json({ message: 'Event created successfully' });
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
    const plusedEvent = await Event.find({_id: eventId, pluses: userId})
    if (plusedEvent[0]) {
      const event = await Event.findByIdAndUpdate({_id: eventId}, {$pull: {'pluses': userId}})
      await event.save()
    } else {
      const event = await Event.findByIdAndUpdate({_id: eventId}, {$push: {'pluses': userId}})
      await event.save()
    }
    res.status(201).json({message: "Plus"});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

const reportEvent = async (req, res) => {
  const {eventId, userId} = req.body
  try {
    const reportedEvent = await Event.find({_id: eventId, reports: userId})
    if (reportedEvent[0]) {
      const event = await Event.findByIdAndUpdate({_id: eventId}, {$pull: {'reports': userId}})
      await event.save()
    } else {
      const event = await Event.findByIdAndUpdate({_id: eventId}, {$push: {'reports': userId}})
      await event.save()
    }
    res.status(201).json({message: "Report"});
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

module.exports = { createEvent, getAllEvents, getEventsInArea, getEventById, plusEvent, reportEvent, upload };