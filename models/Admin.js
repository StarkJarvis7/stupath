var mongoose = require('mongoose');
// admin schema
let adminSchema = new mongoose.Schema({
    username: {type:String},
    password: {type:String}
});
module.exports = mongoose.model('admin',adminSchema);