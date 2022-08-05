const mongoose = require('mongoose');
const collegeSchema = new mongoose.Schema(
    {
        collegeName: {
            type: String
        },
        serial: {
            type: Number,
        }
    });

exports.module = mongoose.model('collegeSchema');