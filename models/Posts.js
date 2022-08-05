var mongoose=require('mongoose');
var PostsSchema= mongoose.Schema(
    {
        collegeName: {type: String},
        PostTitle: {type: String},
        PostDescription: {type: String},
        PostImage: {type: String},
        PostSerial: {type: Number}
    }
);
module.exports =mongoose.model('posts',PostsSchema);
