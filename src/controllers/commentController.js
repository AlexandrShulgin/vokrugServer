const Comment = require('../models/commentModel');
const User = require('../models/userModel');
const path = require('path')
const fs = require('fs')

const createComment = async (req, res) => {
  const { userId, text } = req.body;
  const file = req.file;
  const uploadPath = path.join(__dirname, '../uploads', file.originalname);
  try {
    fs.writeFileSync(uploadPath, file.buffer);
  
    const comment = new Comment({
      author: User.findById({id: userId}),
      text,
      fileUrl: `/uploads/${file.originalname}`,
    })
    await comment.save()
    res.status(201).json({ message: 'Comment' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message});
  }
};

module.exports = { createComment };