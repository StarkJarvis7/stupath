let express = require('express');
let bodyParser = require('body-parser');
let ejs = require('ejs');
let mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const multer = require('multer');
const router = require('./routes/api');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: "This is my little secret",
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());
app.use('/',require('./routes/api'));
//app.use({newUrlParser:true});
let port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});