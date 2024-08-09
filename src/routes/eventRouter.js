const express = require('express');
const { createEvent, getAllEvents, getEventsInArea, plusEvent, reportEvent, getEventById, upload } = require('../controllers/eventController');
const router = express.Router();

router.post('/events/create', upload.array('media', 10), createEvent);
router.post('/events/plus', plusEvent);
router.post('/events/report', reportEvent);
router.get('/events/getAll', getAllEvents);
router.get('/events/getInArea', getEventsInArea);
router.get('/events/getById', getEventById);
module.exports = router;