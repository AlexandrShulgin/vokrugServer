const express = require('express');
const { getMediaByEvent } = require('../controllers/mediaController');
const router = express.Router();

router.get('/media/getByEvent', getMediaByEvent)

module.exports = router;