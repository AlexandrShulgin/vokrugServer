const express = require('express');
const { yandexAuth } = require('../controllers/userController');
const router = express.Router();

router.post('/users', yandexAuth);

module.exports = router;