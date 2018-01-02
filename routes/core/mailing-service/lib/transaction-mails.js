'use strict';
const config = require('../../../../config');
const User = require('../../../../models/user');

const nunjucks = require('nunjucks');
const path = require('path');

const moment = require('moment');

moment.locale('fr');
var OrderMail = (function(){
    var sendgrid  = require('sendgrid')(config.sendGridAPI);

    return {
        userBankTransaction: function(userId, callback) {
            User.findById(userId, function(err, user) {
                if(err) return callback(err);
                if(!user) return callback(new Error('User not found'));
                var content = {
                    user: user
                };
                var templateMail = nunjucks.render(path.join(config.root, 'views/mails/bank-transaction-mail.html'), content);
                sendgrid.send({
                    to:       user.email,
                    from:     'contact@forfait-rembourse.com',
                    subject:  'Transaction RIB Forfait Remboursé',
                    html:     templateMail
                }, function(err, info) {
                    return callback(err, info);
                });
            });
        },
        validateBankTransaction: function(transaction, callback) {
            User.findById(transaction.user.id, function(err, user) {
                if(err) return callback(err);
                if(!user) return callback(new Error('User not found'));
                var content = {
                    user: user,
                    transaction: transaction
                };
                var templateMail = nunjucks.render(path.join(config.root, 'views/mails/transaction-validation.html'), content);
                sendgrid.send({
                    to:       user.email,
                    from:     'contact@forfait-rembourse.com',
                    subject:  'Validation de transaction Forfait Remboursé',
                    html:     templateMail
                }, function(err, info) {
                    return callback(err, info);
                });
            });
        },
        adminBankTransaction: function(userId, callback) {
            User.findById(userId, function(err, user) {
                if(err) return callback(err);
                if(!user) return callback(new Error('User not found'));
                var content = {
                    user: user
                };
                var templateMail = nunjucks.render(path.join(config.root, 'views/mails/bank-transaction-mail-admin.html'), content);
                sendgrid.send({
                    to:       config.admin,
                    from:     'contact@forfait-rembourse.com',
                    subject:  'Transaction RIB Forfait Remboursé',
                    html:     templateMail
                }, function(err, info) {
                    return callback(err, info);
                });
            });
        },

    };
})();

module.exports = OrderMail;
