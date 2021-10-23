const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artist: {
        type: String,
        required: true
    },
    genre: {
        type: String
    },
    year: {
        type: Number
    },
    link: {
        type: String
    },
    image: {
        type: String
    },
    favorite: {
        type: Boolean,
        default: false
    }
});

module.exports = Record = mongoose.model('record', RecordSchema);