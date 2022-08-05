var mongoose = require('mongoose');
let CollegeDetailsSchema = mongoose.Schema({
    collegeName: {type:String},
    collegeAddress: {type:String},
    collegeCity: {type:String},
    collegeState: {type:String},
    collegePincode: {type:String},
    collegeDiscription: {type:String},
    collegeNAAC: {type:String},
    collegeNIRF: {type:String},
    collegeWeb: {type:String},
    collegeCTC: {type:String},
    collegeRC: {type:String},
    collegeCode: {type:String},
    imageName: {type:String},
    img:
    {
        data: Buffer,
        contentType: String
    }
});
module.exports = mongoose.model('clgDetails', CollegeDetailsSchema);
