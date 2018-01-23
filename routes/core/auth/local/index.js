'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');
const User = require('../../../../models/user');
//var Accounts = require('../../../api/user/lib/account-utility');
//var mailAuth = require('../../../core/mailing-service').mailAuth;
var router = express.Router();
/**
* @api {post} /auth/local Local Authentication
* @apiName LocalAuthentication
* @apiGroup Authentication
*
* @apiParam {String} email the user mail.
* @apiParam {String} password the user password.
*
* @apiSuccess {String} message the authentication token.
*/
router.post('/signIn', function(req, res, next) {
    console.log("post");
    passport.authenticate('local', function (err, user, info) {
        var error = err || info;
        if (error) return res.json(401, error);
        if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
        var token = auth.signToken(user._id, user.role);
        res.json({token: token, role: user.role});
    })(req, res, next);
});

var nodemailer = require("nodemailer");

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

/*------------------Routing Started ------------------------*/

router.get('/send',function(req,res, next){
        rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/verify?id="+rand;
    mailOptions={
        to : req.query.to,
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
});

router.get('/verify/:verification_token', function(req, res, next) {
    console.log(req.protocol+":/"+req.get('host'));
    // if ((req.protocol+"://"+req.get('host'))==("http://"+host)) {
        console.log("Domain is matched. Information is from Authentic email");
        console.log(req.params);

        User.findById(req.params.verification_token)
            .exec((err, user) => {
                if(err || !user) {
                    return res.send({
                        ok: false,
                        message: 'User '+req.params.verification_token+' not found'
                    });
                }

                console.log("email is verified");
                // res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
                user.active = true;
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
                        message: 'Email account '+ user.email +' has been verified.'
                    });
                });
            });
    // }
});

/*--------------------Routing Over----------------------------*/

/**
* @api {get} /auth/local/activate-account Activate the user account
* @apiVersion 0.1.0
* @apiPermission owner
* @apiName ActivateUserAccount
* @apiGroup Authentication
* @apiDescription Redirection to login page.
* @apiParam {String} token The user token.
* @apiError TokenUsed The token is already used.
* @apiError BadRequest invalid token.
* @apiError Unauthorized The token not found.
* @apiSampleRequest http://localhost:9090/auth/local/activate-account?token=a6fd7a7f7a2c9ab1f20a9e57acd25596c274ce97829a7d0d54f93dc83bb5a1f4e5beb29540c153ce25c3fdf12abae789
* @apiErrorExample Unauthorized:
*    Error 401: Unauthorized
*    {
*        "message": "Token not found !"
*    }
* @apiErrorExample TokenUsed:
*    HTTP/1.1 Error 401: Unauthorized
*    {
*        "message": "ce token est deja utilise!"
*    }
* @apiErrorExample BadRequest:
*    HTTP/1.1 Error 400: Bad Request
*    [
*        {
*            "param": "token",
*            "msg": "Token invalid"
*        }
*    ]
*/
/*router.get('/activate-account',function(req, res, next) {
    req.checkQuery('token', 'Token invalid').notEmpty();
    var errors = req.validationErrors();
    if (errors) {
        return res.send(errors, 400);
    } else {
        // Activate Account
        Accounts.checkToken(req.query.token, function(err, user) {
            if(err) {
                return res.send({message: err.message}, 401);
            } else {
                var data = {
                    user : user,
                    mailDate: require('moment')().format("Do MMMM YYYY")
                };
                mailAuth.welcomeMail(user.email, data, function(err, infos) {
                    if(err) console.error(err);
                    console.info(infos);
                    // TODO : redirect to success token page
                    res.redirect('/#/login');
                });
            }
        });
    }
});*/

module.exports = router;
