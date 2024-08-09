const express = require('express');
const multer = require('multer')
const { createComment, getCommentByEvent, upload } = require('../controllers/commentController');
const router = express.Router();

router.post('/comments/create', upload.single('media'), createComment);
router.get('/comments/getByEvent', getCommentByEvent)

module.exports = router;