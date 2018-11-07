const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    caption: {
        type: String,
        required: true
    }
});

const SaveImage = mongoose.model('SaveImage', imageSchema);

exports.SaveImage = SaveImage;