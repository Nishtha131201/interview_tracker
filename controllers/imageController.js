const multer = require('multer');
const fs = require('fs');
const path = require('path');

var storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename : (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
});

const upload = multer({storage : storage});
const {Router} = require('express');
const router = Router();
const Company = require('../models/Company');
const User = require('../models/User');

router.get('/company', (req, res) => {
    Company.find({}, (err, items) => {
        if (err){
            console.log(err);
        }
        else {
            res.render('imageView', {items : items});
        }
    });
});

router.post('/company', upload.single('image'), (req, res, next) => {
    // console.log("req :  ", req.body);
    console.log("Here we go : ", req.file);
    console.log(req.file.fieldname);
    var object = {
        name : req.body.name, 
        link : req.body.link,
        img : {
            data : fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),
            contentType : 'image/png'
        },
    
        
    }
    // console.log('object : ', object);
    Company.create(object, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    })
});
router.get('/userUpdation', (req, res) => {
   res.render('interview/userUpdation');
});

router.post('/userUpdation', upload.single('image'), (req, res, next) => {
    // console.log("req :  ", req.body);
    // console.log("Here we go : ", req.file);
    // console.log("req, res : ", req, res);
    const user = res.locals.user;
    console.log("user = ", user, req.file);
    console.log('req.body', req.body);
    var {email, sD, firstName, lastName} = req.body;
    console.log("email sd fn", email, sD, firstName);
    if (email == null || email == "") email = user.email;
    if (sD == null || sD == "") sD = user.shortDescription;
    if (firstName == null || firstName == "") firstName = user.firstName;
    if (lastName == null || lastName == "") lastName = user.lastName;
    var data, img;
    if (req.file != null && req.file.filename) {
        data = fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename));
        img = {data , contentType: 'image/png'};
    }
    else {
        img = user.img;
    }
    const obj = {
        email : email,
        img : img,
        firstName : firstName,
        lastName : lastName,
        shortDescription : sD 
    };
    console.log("obj = ", obj);
    User.findOneAndUpdate({_id: user._id}, obj).then(res.redirect('/'))
    .catch(err => console.log("eror : ", err));
});

module.exports = router;