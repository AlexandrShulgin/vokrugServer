const express = require('express');
const multer = require('multer')
const { createComment } = require('../controllers/commentController');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/comments', upload.single('file'), createComment);

module.exports = router;