var mongoose = require('mongoose');
let LogoSchema = mongoose.Schema({
    clgName: {type:String},
    imageName: {type:String},
    img:
    {
        data: Buffer,
        contentType: String
    }
});
module.exports = mongoose.model('logo', LogoSchema);
