'use strict';

var nodemailer = require("nodemailer");
const User = require('../../../models/user');

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "anas.demnati2@gmail.com",
        pass: "hzvbtytxxerqlwdc"
    }
});
var rand,mailOptions,host,link;
/*------------------SMTP Over-----------------------------*/

exports.validateUser = (req, res, next) => {
    req.checkBody('firstName', 'The first name is require').notEmpty();
    req.checkBody('lastName', 'The last name is require').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('gender', 'Invalid gender').notEmpty().matches(/[fe]{0,1}male/);
    req.checkBody('password', 'Invalid password').notEmpty().isLength({
        min: 6,
        max: 16
    });

    let errors = req.validationErrors();

    if (errors) {
        return res.send(500, {
            ok: false,
            message: errors[0].msg,
            errors: errors
        });
    } else {
        next();
    }

};

exports.create = (req, res, next) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password,
        role: req.body.role,
        registrations: req.body.registrations,
        domaine: req.body.domaine,
        created: new Date()
    });
    user.save((err) => {
        if(err) {
            return res.send({
                ok: false,
                message: 'Something went wrong!',
                err: err
            });
        } else {
            //Send activation email
        host=req.get('host');
        link="http://"+req.get('host')+"/verify/verification_token="+user._id;
        mailOptions={
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>"
        };
        console.log(mailOptions);
        smtpTransport.sendMail(mailOptions, function(error, response){
         if(error){
                console.log(error);
            res.end("error");
         }else{
                console.log("Message sent: " + response.message);
            res.end("sent");
             }
      });
            return res.send({
                ok: true,
                data: user,
                message: 'You account has been succefully created!'
            });
        }
    });
};

exports.update = (req, res, next) => {
    let currentUserId = req.params.userId;
    // let currentUserId = req.user._id;
    console.log(req.body);
    User.findById(currentUserId)
        .select('-hashedPassword -salt -__v -deleted -created')
        .exec((err, user) => {
        if(err || !user) {
            return res.send({
                ok: false,
                message: 'User not found'
            });
        }
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.gender = req.body.gender || user.gender;
        user.location = req.body.location || user.location;
        user.phone = req.body.phone || user.phone;
        user.active = req.body.active || user.active;
        user.avatar_url = req.body.avatar_url || user.avatar_url;
        user.university = req.body.university || user.university;
        user.labo = req.body.labo || user.labo;
        user.domaine = req.body.domaine || user.domaine;
        if(req.body.password)
            user.password = req.body.password;
        user.updated = new Date();
        user.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error updating profile please try later!'
                });
            }
            return res.send({
                ok: true,
                data: user
            });
        });
    });
};

exports.delete = (req, res, next) => {
    let currentUserId = req.params.userId;

    User.findById(currentUserId)
        .exec((err, user) => {
        if(err || !user) {
            return res.send({
                ok: false,
                message: 'User not found'
            });
        }
        user.updated = new Date();
        user.deleted = true;
        user.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error updating profile, please try later!'
                });
            }
            return res.send({
                ok: true,
                data: user
            });
        });
    });
};

exports.getAllUsers = (req, res, next) => {
    User.find({})
        .exec((err, users) => {
        if(err || !users) {
            return res.send({
                ok: false,
                message: 'Users not found'
            });
        }
        console.log(users);
        return res.send({
            ok: true,
            data: users
        });
    });
};

exports.getUsersCount = (req, res, next) => {
    let role = req.params.role;
    console.log(role);
    User.find({"role" : role, "deleted" : false})
        .count()
        .exec((err, usersCount) => {
        if(err || !usersCount) {
            return res.send({
                ok: false,
                message: 'Users not found'
            });
        }
        console.log(usersCount);
        return res.send({
            ok: true,
            data: usersCount
        });
    });
};

exports.getUsersByCongre = (req, res, next) => {
    let congreId = req.params.congreId;

    User.find({"registrations.congreId" : congreId})
        .exec((err, users) => {
        if(err || !users) {
            return res.send({
                ok: false,
                message: 'Users not found'
            });
        }
        return res.send({
            ok: true,
            data: users
        });
    });
};

exports.me = (req, res, next) => {
    console.log('me ctrl');
    const currentUserId = req.user._id;
    console.log('req id');
    User.findById(currentUserId)
      .select('-hashedPassword -salt -deleted')
      .exec((err, user) => {
        if(err || !user) {
            return res.send({
                ok: false,
                message: 'User not found!'
            });
        }
        return res.send({
            ok: true,
            data: user
        });
    });
};
