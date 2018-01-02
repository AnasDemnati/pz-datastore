'use strict';
var config = require('../../../../config');
var nunjucks = require('nunjucks');
var path = require('path');
var MailAuth = (function(){
    var sendgrid  = require('sendgrid')(config.sendGridAPI);

    return {
        mailSignin: function(mail, data, callback) {
            data.hostName = config.host;
            var templateMail = nunjucks.render(path.join(config.root, 'views/mails/mail-singup.html'), data);
            sendgrid.send({
                to:       mail,
                from:     'contact@forfait-rembourse.com',
                subject:  'Activation de votre compte',
                html:     templateMail,
            }, function(err, info) {
                return callback(err, info);
            });
        },
        welcomeMail: function(mail, content, callback) {
            var templateMail = nunjucks.render(path.join(config.root, 'views/mails/welcome-mail.html'), content);
            sendgrid.send({
                to:       mail,
                from:     'contact@forfait-rembourse.com',
                subject:  'Bienvenu au service Forfait rembourser',
                html:     templateMail
            }, function(err, info) {
                return callback(err, info);
            });
        },
        resetPassword: function(mail, content, callback) {
            content.hostName = config.host;
            var templateMail = nunjucks.render(path.join(config.root, 'views/mails/reset-password.html'), content);
            sendgrid.send({
                to:       mail,
                from:     'contact@forfait-rembourse.com',
                subject:  'Réinitialisation du mot de passe du compte forfait remboursé',
                html:     templateMail
            }, function(err, info) {
                return callback(err, info);
            });
        }
    };
})();

module.exports = MailAuth;
