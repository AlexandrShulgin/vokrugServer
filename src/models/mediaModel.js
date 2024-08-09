const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema({
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  },
  media: {
    type: [String],
  },
}, { timestamps: true });

const Media = mongoose.model('Media', MediaSchema);

module.exports = Media;
