const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for experience image uploads
const uploadDir = path.join(__dirname, '../../frontend/public/experiences');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

// GET all experiences
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ createdAt: -1 });
        res.json(experiences);
    } catch (err) {
        console.error("Get experiences error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// POST new experience
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { userName, eventName, description } = req.body;

        const newExperience = new Experience({
            userName,
            eventName,
            description,
            image: req.file ? `/experiences/${req.file.filename}` : ''
        });

        await newExperience.save();
        res.status(201).json(newExperience);
    } catch (err) {
        console.error("Create experience error:", err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
