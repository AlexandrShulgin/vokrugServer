const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    y_id: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true,
    },
    display_name: {
      type: String,
      required: true,
    },
    avatar_id: {
      type: String,
    }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

module.exports = User;
