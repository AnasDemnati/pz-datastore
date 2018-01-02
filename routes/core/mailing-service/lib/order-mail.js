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
        makerOrderUser: function(userId, product, address, callback) {
            User.findById(userId, function(err, user) {
                if(err) return callback(err);
                if(!user) return callback(new Error('User not found'));
                var content = {
                    user: user,
                    product: product,
                    orderDate: moment().format("Do MMMM YYYY"),
                    address: address
                };
                var templateMail = nunjucks.render(path.join(config.root, 'views/mails/order-user.html'), content);
                sendgrid.send({
                    to:       user.email,
                    from:     'contact@forfait-rembourse.com',
                    subject:  'Nouvel achat Forfait Remboursé',
                    html:     templateMail
                }, function(err, info) {
                    return callback(err, info);
                });
            });
        },
        makerOrderAdmin: function(product, address, callback) {
            var content = {
                product: product,
                orderDate: moment().format("Do MMMM YYYY"),
                address: address
            };
            var templateMail = nunjucks.render(path.join(config.root, 'views/mails/order-validation-admin.html'), content);
            sendgrid.send({
                to:       config.admin,
                from:     'contact@forfait-rembourse.com',
                subject:  'Nouvel achat Forfait Remboursé',
                html:     templateMail
            }, function(err, info) {
                return callback(err, info);
            });
        },
        orderValidation: function(order, callback) {
            User.findById(order.user_id, function(err, user) {
                if(err) return callback(err);
                if(!user) return callback(new Error('User not found'));
                var content = {
                    user: user,
                    orderDate: moment().format("Do MMMM YYYY"),
                    order: order
                };
                var templateMail = nunjucks.render(path.join(config.root, 'views/mails/order-validation.html'), content);
                sendgrid.send({
                    to:       user.email,
                    from:     'contact@forfait-rembourse.com',
                    subject:  (order.status==='REJECTED') ? 'Annulation de votre commande Forfait Remboursé':'Validation de votre commande Forfait Remboursé',
                    html:     templateMail
                }, function(err, info) {
                    return callback(err, info);
                });
            });
        }
    };
})();

module.exports = OrderMail;
