var express=require('express');
var router= express.Router();
var AddCGExpert= require('../models/AddCGExpert');
var Admin= require('../models/Admin')
var ClgCourses= require('../models/CollegeCourses');
var ClgDetails= require('../models/CollegeDetails');
var ContactUs= require('../models/ContactUs');
var Logo= require('../models/Logo');
var AddCGExpert= require('../models/AddCGExpert');
var posts= require('../models/Posts');
var mongoURI= require('../config/config.json');
const passport = require('passport');
var mongoose = require('mongoose');
let _ = require("lodash");
const fs = require('fs');
let path = require("path");
let multer = require("multer");
//const passportLocalMongoose = require('passport-local-mongoose');
var upload = multer({ storage: storage });
var uploadLogo = multer({ storage: logostorage });
var uploadCGExpert = multer({ storage: CGExpertStorage });


//router.plugin(passportLocalMongoose);
router.use(passport.initialize());
router.use(passport.session());


//mongo db connection
mongoose.connect(mongoURI.mongoURI);

// // use while hosting
// const link = -------------------give link here
//mongoose.connect("mongodb+srv://stupath:rtpl2022@stupath.mufry6e.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useCreateIndex', true);





//scheams


//passport.use(Adminlogin.createStrategy());
//passport.serializeUser(Adminlogin.serializeUser());
//passport.deserializeUser(Adminlogin.deserializeUser());
// giving storage 
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/ClgImages")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

var logostorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/ClgLogo")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

var CGExpertStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images/CGImages")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
});

router.get("/", function (req, res) {
    AddCGExpert.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            ClgDetails.find({}, function (err, clgsData) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("home", { clgsData: clgsData, data: data });
                }
            });
        }
    })
});

router.get("/about", function (req, res) {
    res.render("about");
});

router.get("/c-g-experts", function (req, res) {
    AddCGExpert.find({}, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            res.render("careerGuidence", { data: data });
        }
    })
});

router.get("/allcolleges", function (req, res) {
    ClgDetails.find({}, function (err, clgsData) {
        if (err) {
            console.log(err);
        } else {
            res.render("allColleges", { clgsData: clgsData });
        }
    });
});
router.get("/college/:clgname", function (req, res) {
    let clgname = req.params.clgname;
    ClgDetails.findOne({ collegeName: clgname }, function (err, clgData) {
        if (err) {
            console.log(err);
        } else {
            ClgCourses.find({ collegeName: clgname }, function (err, clgCoursesData) {
                if (err) {
                    console.log(err);
                } else {
                    Logo.findOne({ clgName: clgname }, function (err, logoData) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("college", { clgData: clgData, clgCoursesData: clgCoursesData, logoData: logoData });
                        }
                    });
                }
            });
        }
    });
})


router.get("/clgSearch/:keyword", function (req, res) {

    let keyword = _.lowerCase(req.params.keyword);
    // let keyword = req.params.keyword
    console.log(keyword);
    ClgDetails.find({ $or: [{ collegeName: keyword }, { collegeAddress: keyword }, { collegeCity: keyword }, { collegeState: keyword }, { collegePincode: keyword }, { collegeNAAC: keyword }, { collegeNIRF: keyword }] }, function (err, clgsData) {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(clgsData);
            if (clgsData.length == 0) {
                ClgCourses.find({ $or: [{ courseName: keyword }, { courseDuration: keyword }, { courseFee: keyword }] }, function (err, clgCoursesData) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        // console.log(clgCoursesData)
                        clgCoursesData.forEach(function (clg) {
                            ClgDetails.find({ collegeName: clg.collegeName }, function (err, data) {
                                console.log(data);
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    clgsData.push(data);
                                }
                            })
                        })
                        res.render("allcolleges", { clgsData: clgsData });
                    }
                })
                // console.log(clgsData)
            } else {
                res.render("allcolleges", { clgsData: clgsData });
            }
        }
    });
});


router.get("/c-g-expert/:expertName", function (req, res) {
    let expertName = req.params.expertName;
    AddCGExpert.findOne({ name: expertName }, function (err, expertData) {
        if (err) {
            console.log(err);
        } else {
            res.render("cgExpert", { expertData: expertData });
        }
    });
}
);


router.get("/admin/:adminVar", function (req, res) {
    if (req.isAuthenticated()) {
        var adminVar = req.params.adminVar;
        if (adminVar == "dashboard") {
            ClgDetails.find({}, function (err, clgsData) {
                if (err) {
                    console.log(err);
                }
                else {
                    AddCGExpert.find({}, function (err, addCGExpertData) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            res.render("ad_dash", { clgsData: clgsData, CGExpertData: addCGExpertData });
                        }
                    });
                }
            });
        }
        else if (adminVar == "add-college") {
            res.render("ad_addCollege", { formStage: 1 });
        }
        else if (adminVar == "view-contactus") {
            ContactUs.find({}, function (err, contactUsData) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("ad_viewContactUs", { contactUsData: contactUsData });
                }
            });
        } else if (adminVar == "view-C-G-Experts") {
            AddCGExpert.find({}, function (err, cgExpertData) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("ad_viewCGExperts", { cgExpertData: cgExpertData });
                }
            });
        } else if (adminVar == "view-clgs") {
            ClgDetails.find({}, function (err, clgData) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render("ad_viewClg", { clgData: clgData });
                }
            });
        }
        else if (adminVar == "add-c-g-expert") {
            res.render("ad_addCgExpert");
        }
    } else {
        res.redirect("/Adminlogin");
    }

});




router.post("/addCollegeDetailes1", upload.single("collegeImage"), function (req, res) {// Image to be uploaded
    const tempclgName = _.lowerCase(req.body.collegeName);
    // console.log(tempclgName);
    ClgDetails.find({ collegeName: tempclgName }, function (err, data) {
        if (data.length == 0) {
            var fileinfo = req.file;
            const clgDetails = new ClgDetails({
                collegeName: _.lowerCase(req.body.collegeName),
                collegeAddress: _.lowerCase(req.body.collegeAddress),
                collegeCity: _.lowerCase(req.body.collegeCity),
                collegeState: _.lowerCase(req.body.collegeState),
                collegePincode: req.body.collegePincode,
                collegeDiscription: req.body.collegeDiscription,
                collegeNAAC: req.body.collegeNAAC,
                collegeNIRF: req.body.collegeNIRF,
                collegeWeb: req.body.collegeWeb,
                collegeCTC: req.body.collegeCTC,
                collegeRC: req.body.collegeRC,
                collegeCode: req.body.collegeCode,
                imageName: fileinfo.filename,
                img: {
                    data: fs.readFileSync(path.join(__dirname + '/public/images/ClgImages/' + req.file.filename)),
                    contentType: 'image/png'
                }
            });
            clgDetails.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    ClgDetails.find({ collegeName: tempclgName }, function (err, data) {
                        // console.log(data);
                        res.render("ad_addCollege", { formStage: 2, data: data, clgCourses: null, clgId: tempclgName });
                    });
                }
            });
        } else {
            console.log("college already exists");
        }
    });
});

router.post("/addCourses", function (req, res) {
    const clgName = _.lowerCase(req.body.collegeId);
    console.log(clgName);
    ClgDetails.find({ collegeName: clgName }, function (err, data) {
        if (data.length == 0) {
            console.log("Some thing Went Wrong");
        } else {
            const clgCourses = new ClgCourses({
                collegeName: clgName,
                courseName: _.lowerCase(req.body.courseName),
                courseDuration: req.body.courseDuration,
                courseFee: req.body.courseFee
            });
            clgCourses.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    ClgCourses.find({ collegeName: clgName }, function (err, data) {
                        // console.log(data);
                        res.render("ad_addCollege", { formStage: 2, clgId: clgName, clgCourses: data });
                    });
                }
            });
        }
    })
});
/*
router.post("/addLogo", uploadLogo.single("clgLogo"), function (req, res) {
    const clgName = _.lowerCase(req.body.collegeId);
    var fileinfo = req.file;
    console.log(clgName);
    const clgLogo = new Logo({
        clgName: clgName,
        imageName: fileinfo.filename,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/public/images/ClgLogo/' + req.file.filename)),
            contentType: 'image/png'
        }
    });
    clgLogo.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin/dashboard");

        }
    }
    );
});


router.post("/addPerson", uploadCGExpert.single("CGImage"), function (req, res) {
    var fileinfo = req.file;
    const person = new AddCGExpert({
        name: _.lowerCase(req.body.name),
        email: _.lowerCase(req.body.email),
        phone: req.body.phoneNo,
        aPhone: req.body.APhoneNo,
        address: _.lowerCase(req.body.address),
        city: _.lowerCase(req.body.city),
        state: _.lowerCase(req.body.state),
        pincode: req.body.pincode,
        charges: req.body.charges,
        mode: _.lowerCase(req.body.mode),
        description: req.body.description,
        experience: _.lowerCase(req.body.experience),
        expertIn: _.lowerCase(req.body.expertIn),
        imageName: req.body.imageName,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/public/images/CGImages/' + req.file.filename)),
            contentType: 'image/png'
        }

    });
    person.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin/view-C-G-Experts");
        }
    });
})


*/
router.post("/contactUs", function (req, res) {
    const contactUs = new ContactUs({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message
    });
    contactUs.save(function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/");
        }
    });
})

router.post("/dltContactUs", function (req, res) {
    const dltContact = req.body.dltContact;
    ContactUs.findByIdAndDelete(dltContact, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin/view-contactus");
        }
    });
})

router.post("/dltExpert", function (req, res) {
    const dltExpert = req.body.dltExpert;
    AddCGExpert.findByIdAndDelete(dltExpert, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin/view-C-G-Experts");
        }
    });
});

router.post("/dltClg", function (req, res) {
    const dltClg = req.body.dltClg;
    ClgDetails.findByIdAndDelete(dltClg, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect("/admin/view-clgs");
        }
    });
});


router.post("/HomeSearch", function (req, res) {
    let search = _.lowerCase(req.body.search);
    console.log(search);
    res.redirect("/clgSearch/" + search);
})


// clg search
router.post("/clgSearch", function (req, res) {
    let search = _.lowerCase(req.body.search);
    res.redirect("/clgSearch/" + search);
});




//admin login details

// admin login

router.post("/login", function (req, res) {

    user = new Adminlogin({
        username: req.body.username,

        password: req.body.password
    });


    req.login(user, function (err) {
        if (err) {

            res.redirect("/login");
        } else {
            //passport.authenticate("local")(req, res, function () {
                res.redirect("/admin/dashboard");
            //});
        }
    });


});

//Creating post
router.post('/:college/createPost', function(req,res){//TODO: check college in db validate,
    //create link between both models - college 
    // word limits on discussion
    const PostsObj= new PostsModel({
    PostTitle: req.body.Title,
    PostSerial: req.body.Serial,
    PostDescription: req.body.Description,
    PostImage: req.body.Image
    });
    PostsObj.save();
    res.status(200);
    });
//Read Post

router.post('/readPosts', function(req,res){
    const PostsObj= new PostsModel({
    PostTitle: req.body.title,
    PostSerial: req.body.Serial,
    PostDescription: req.body.Description,
    PostImage: req.body.Image
    });
    PostsObj.findAll();
    res.render()
    //res.status(200).send(PostsObj);
    });

//Update Post

router.put('/readPosts', function(req,res){
    const PostsObj= new PostsModel({
    PostTitle: req.body.title,
    PostSerial: req.body.Serial,
    PostDescription: req.body.Description,
    PostImage: req.body.Image
    });
    PostsObj.findOne();
    });
// post for register
router.post("/regis", function (req, res) {

    Adminlogin.register({
        username: req.body.username,

    }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);

            res.redirect("/AdminRegister");
        } else {
            //passport.authenticate('local')(req, res, function () {
                res.redirect("/Adminlogin");
            //});
        }
    });
})


// admin login
router.get("/Adminlogin", function (req, res) {
    res.render("login");
});

//register
router.get("/AdminRegister", function (req, res) {

    res.render("register");

});


//Get Logout Page 

router.get('/logout', function (req, res, next) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports=router;
