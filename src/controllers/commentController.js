const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const path = require('path')
const turf = require('@turf/turf');
const multer = require('multer');
const fs = require('fs');
const Event = require('../models/eventModel');

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

    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed!'));
    }
}
});

const createComment = async (req, res) => {
  const { authorId, eventId, text } = req.body;
  const myMedia = req.file ? req.file.path : '';
  try {
      const comment = new Comment({
          author: authorId,
          event: eventId,
          text,
          media: myMedia
      });
      await comment.save();
      res.status(201).json({ message: 'Comment' });
  } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

const getCommentByEvent = async (req, res) => {
  const { eventId } = req.query;
  try {
    const comments = await Comment.find({ event: eventId })
      .populate('author');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createComment, getCommentByEvent, upload };