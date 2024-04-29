const Admin = require('../models/admin');
const bcrypt = require("bcryptjs");
const jwtUtils = require("../utils/jwtUtils");

const createAdmin = async (req, res) => {
    const { username, password, role } = req.body;

    let admin = await Admin.findOne({ username });
    if (admin) {
        return res.status(409).json({ message: 'Username already in use' });
    }

    try {
        admin = new Admin({ username, password, role });

        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(password, salt);

        await admin.save();
        res.status(201).json({ message: 'Admin created successfully' });
    } catch (error) {
        console.error(error.message);
        console.error(error.stack);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const loginAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: "Invalid Username" });
        }

        const isPasswordMatch = await bcrypt.compare(password, admin.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const payload = {
            userId: admin._id,
            username: admin.username,
            role: admin.role,
        }
        const token = jwtUtils.generateToken(payload);
        const refreshToken = jwtUtils.generateRefreshToken(payload);

        res.json({ token, refreshToken, role, msg: "Login successful" });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        const decodedToken = jwtUtils.verifyRefreshToken(refreshToken);

        const admin = await Admin.findById(decodedToken.userId);
        if (!admin) {
            return res.status(401).json({ error: 'User not found' });
        }

        const payload = {
            userId: admin._id,
            username: admin.username,
            role: admin.role,
        };
        const token = jwtUtils.generateToken(payload);

        res.json({ token });
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Refresh token has expired' });
        }
        res.status(401).json({ error: 'Invalid refresh token' });
    }
};

module.exports = {
    createAdmin,
    loginAdmin,
    refreshToken
}
