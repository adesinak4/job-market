const User = require('../models/user');
const fs = require('fs').promises;
const path = require('path');
const resumeUploadPath = './uploads/resumes';

const createUser = async (req, res) => {
    const { firstname, lastname, email, phoneNumber, location, profession, sector, yoe, linkedInUrl, gitHubUrl, portfolioUrl, stack } = req.body; // Destructure user data
    const resumeBuffer = req.file?.buffer; // Access resume buffer if file uploaded

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: 'Email already in use' });
    }

    const newUser = new User({ firstname, lastname, email, phoneNumber, location, profession, sector, yoe, linkedInUrl, gitHubUrl, portfolioUrl, stack });
    const fullname = `${firstname}-${lastname}`;
    try {
        if (resumeBuffer) {
            const filename = `${fullname}-resume.pdf`;
            const filePath = path.join(resumeUploadPath, filename); // Create full file path
            try {
              await fs.writeFile(filePath, resumeBuffer); // Write resume to file system
              newUser.resumeUrl = filePath; // Update User model with resume URL
            } catch (error) {
              console.error('Error saving resume:', error);
            }
          }
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const fetchUsers = async (req, res) => {
    const { stack, yoe, location, profession } = req.query; // Get filter parameters

    let filters = {};
    if (stack) {
        filters.stack = { $in: [new RegExp(stack, 'i')] }; // Filter by multiple stack elements
    }
    if (yoe) {
        filters.yoe = { $gte: yoe }; // Filter by minimum experience
    }
    if (location) {
        filters.location = new RegExp(location, 'i'); // Case-insensitive location search
    }
    if (profession) {
        filters.profession = new RegExp(profession, 'i'); // Case-insensitive profession search
    }

    try {
        const users = await User.find(filters);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    createUser,
    fetchUsers,
};
