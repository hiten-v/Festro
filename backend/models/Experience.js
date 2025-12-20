const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    eventName: {
        type: String,
        required: true,
        trim: true
    },
    eventDate: {
        type: String,
        required: true,
        default: () => new Date().toISOString().split('T')[0]
    },
    eventTime: {
        type: String,
        required: true,
        default: () => new Date().toTimeString().split(' ')[0] 
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Experience', experienceSchema);
