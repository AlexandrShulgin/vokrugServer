const User = require('../models/userModel');

const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = new User({
            name,
            email,
            password,
        });

        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = { createUser };