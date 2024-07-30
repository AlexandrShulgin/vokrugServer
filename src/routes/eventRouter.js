const express = require('express');
const { createEvent, getAllEvents, getEventsInArea } = require('../controllers/eventController');
const router = express.Router();

router.post('/events', createEvent);
router.get('/events', getAllEvents);
router.get('/events/area', getEventsInArea);
module.exports = router;