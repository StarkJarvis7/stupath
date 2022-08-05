var mongoose = require('mongoose');
const CollegeCoursesSchema = new mongoose.Schema({
    collegeName: { type: String},
    courseName: {type: String},
    courseDuration: {type: String},
    courseFee: {type: String}
});
module.exports = mongoose.model('clgCourses', CollegeCoursesSchema);
