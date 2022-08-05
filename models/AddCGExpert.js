var mongoose = require('mongoose');
let AddCGExpertSchema = ({
    name: {type: String},
    email: {type:String},
    phone: {type:String},
    aPhone: {type:String},
    address: {type:String},
    city: {type:String},
    state: {type:String},
    pincode: {type:String},
    charges: {type:String},
    mode: {type:String},
    description: {type:String},
    experience: {type:String},
    expertIn: {type:String},
    imageName: {type:String},
    img:
    {
        data: Buffer,
        contentType: String
    }
});
module.exports = mongoose.model('addCGExpert', AddCGExpertSchema);
