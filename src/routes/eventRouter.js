const express = require('express');
const { createEvent, getAllEvents } = require('../controllers/eventController');
const router = express.Router();

router.post('/events', createEvent);
router.get('/events', getAllEvents)

module.exports = router;