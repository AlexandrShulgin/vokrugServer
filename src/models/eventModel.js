const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    coordinates: {
        type: [Number],
        required: true,
        validate: {
            validator: function(array) {
                return array.length === 2;
            },
            message: 'Coordinates must be an array of two numbers.'
        }
    },
    address: {
      name: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    time: {
        type: Number,
        default: 900000
    },
    userId: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
