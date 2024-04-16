const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    location: {
        type: String,
    },
    profession: {
        type: String,
    },
    sector: {
        type: String,
    },
    yoe: {
        type: Number,
    },
    linkedInUrl: {
        type: String,
    },
    gitHubUrl: {
        type: String,
    },
    portfolioUrl: {
        type: String,
    },
    stack: {
        type: [String], // Array of strings for different technologies
    },
    resumeUrl: {
        type: String,
        trim: true, // Remove leading/trailing whitespaces
      },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
