const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

//dangki
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: "This email already exist!" });

        const user = await User.create({ name, email, password });
        res.status(201).json({ _id: user._id, name: user.name, email: user.email });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//dangnhap
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                token: token
            });
        } else {
            res.status(401).json({ message: "Wrong email or password! Try again." });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
