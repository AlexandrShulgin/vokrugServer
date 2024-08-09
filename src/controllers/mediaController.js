const Media = require('../models/mediaModel')

const getMediaByEvent = async (req, res) => {
  const { eventId } = req.query;
  try {
    const media = await Media.find({ event: eventId })
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMediaByEvent };