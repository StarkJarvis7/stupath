
var mongoose = require('mongoose');
let ContactUsSchema = mongoose.Schema({
    name: {type:String},
    email: {type:String},
    subject: {type:String},
    message: {type:String}
});
module.exports = mongoose.model('contactUs', ContactUsSchema);
