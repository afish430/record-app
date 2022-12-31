const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        index: { unique: true }
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = User = mongoose.model('user', UserSchema);