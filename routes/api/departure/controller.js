'use strict';

const Departure = require('../../../models/departure');
const User = require('../../../models/user');

exports.validateDeparture = (req, res, next) => {
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('description', 'description is required').notEmpty();
    req.checkBody('thematique', 'thematique is required').notEmpty();
    req.checkBody('start_date', 'start_date is required').notEmpty();
    req.checkBody('end_date', 'end_date is required').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        return res.send(500, {
            ok: false,
            message: errors[0],
            err: errors
        });
    } else {
        next();
    }
};

exports.newDeparture = (req, res, next) => {
    let departure = new Departure({
        tripCode: req.body.tripCode,
        userCode: req.user._id,
        productCode: req.body.productCode,
        numberOfPax: req.body.numberOfPax,
        startingDate: req.body.startingDate,
        endingDate: req.body.endingDate,
        accounts: req.body.accounts,
        created: new Date()
    });

    departure.save((err) => {
        if(err) {
            return res.send({
                ok: false,
                message: 'Error in departure creation'
            });
        }
        return res.send({
            ok: true,
            message: 'Departure created'
        });
    });
};

exports.updateDeparture = (req, res, next) => {
    let departureId = req.params.departureId;

    Departure.findById(departureId)
        .exec((err, departure) => {
        if(err || !departure) {
            return res.send({
                ok: false,
                message: 'Departure not found'
            });
        }

        departure.tripCode = req.body.tripCode || departure.tripCode;
        departure.userCode = req.body.userCode || departure.userCode;
        departure.productCode = req.body.productCode || departure.productCode;
        departure.numberOfPax = req.body.numberOfPax || departure.numberOfPax;
        departure.startingDate = req.body.startingDate || departure.startingDate;
        departure.endingDate = req.body.endingDate || departure.endingDate;
        departure.accounts = req.body.accounts || departure.accounts;
        departure.updated = new Date();

        departure.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while updating departure'
                });
            }
            return res.send({
                ok: true,
                data: departure
            });
        });
    });
};

exports.updateDepartureAccounts = (req, res, next) => {
    let departureId = req.params.departureId;
    let accountIndex = req.params.accountIndex;

    Departure.findById(departureId)
        .exec((err, departure) => {
        if(err || !departure) {
            return res.send({
                ok: false,
                message: 'Departure not found'
            });
        }

        departure.accounts[accountIndex].date = req.body.accounts[accountIndex].date || departure.accounts[accountIndex].date;
        departure.accounts[accountIndex].description = req.body.accounts[accountIndex].description || departure.accounts[accountIndex].description;
        departure.accounts[accountIndex].budgetCurrency = req.body.accounts[accountIndex].budgetCurrency || departure.accounts[accountIndex].budgetCurrency;
        departure.accounts[accountIndex].budgetAmount = req.body.accounts[accountIndex].budgetAmount || departure.accounts[accountIndex].budgetAmount;
        departure.accounts[accountIndex].actualCurrency = req.body.accounts[accountIndex].actualCurrency || departure.accounts[accountIndex].actualCurrency;
        departure.accounts[accountIndex].actualAmount = req.body.accounts[accountIndex].actualAmount || departure.accounts[accountIndex].actualAmount;
        departure.accounts[accountIndex].affectedBudget = req.body.accounts[accountIndex].affectedBudget || departure.accounts[accountIndex].affectedBudget;
        departure.accounts[accountIndex].comment = req.body.accounts[accountIndex].comment || departure.accounts[accountIndex].comment;
        departure.accounts[accountIndex].expenseCategory = req.body.accounts[accountIndex].expenseCategory || departure.accounts[accountIndex].expenseCategory;
        departure.accounts[accountIndex].paymentType = req.body.accounts[accountIndex].paymentType || departure.accounts[accountIndex].paymentType;
        departure.accounts[accountIndex].altUserCode = req.body.accounts[accountIndex].altUserCode || departure.accounts[accountIndex].altUserCode;
        departure.accounts[accountIndex].altTripCode = req.body.accounts[accountIndex].altTripCode || departure.accounts[accountIndex].altTripCode;
        departure.accounts[accountIndex].updated = new Date();
        departure.updated = new Date();

        departure.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while updating accounts'
                });
            }
            return res.send({
                ok: true,
                data: departure
            });
        });
    });
};

exports.deleteDeparture = (req, res, next) => {
    let departureId = req.params.departureId;

    Departure.findById(departureId)
        .exec((err, departure) => {
        if(err || !departure) {
            return res.send({
                ok: false,
                message: 'Departure not found'
            });
        }
            departure.deleted = true;
            departure.updated = new Date();

            departure.save((err) => {
                if(err) {
                    return res.send({
                        ok: false,
                        message: 'Error while deleting departure'
                    });
                }
                return res.send({
                    ok: true,
                    data: departure
                });
            });
    });
};

exports.getDepartureById = (req, res, next) => {
    let departureId = req.params.departureId;

    Departure.findById(departureId)
        .populate("presentations.altUserCode presentations.altTripCode")
        .exec((err, departure) => {
        if(err || !departure) {
            return res.send({
                ok: false,
                message: 'Departure not found'
            });
        }
        return res.send({
            ok: true,
            data: departure
        });
    });
};

exports.getAllDepartures = (req, res, next) => {

    Departure.find({})
        .exec((err, departures) => {
        if(err || !departures) {
            return res.send({
                ok: false,
                message: 'Departures not found'
            });
        }
        return res.send({
            ok: true,
            data: departures
        });
    });
};

// exports.getSessionsByCongre = (req, res, next) => {
//     let congreId = req.params.congreId;
//
//     Session.find({"congre_id" : congreId, "deleted" : false, "title" : {$ne : "general"}})
//         .populate("presentations.speaker")
//         .populate({
//             path: 'presentations.publication_id',
//             populate: { path: 'author' }
//           })
//         .exec((err, sessions) => {
//         if(err || !sessions) {
//             return res.send({
//                 ok: false,
//                 message: 'Session not found'
//             });
//         }
//         return res.send({
//             ok: true,
//             data: sessions
//         });
//     });
// };
//
// exports.getPresentationsBySession = (req, res, next) => {
//     let sessionId = req.params.sessionId;
//
//     Session.findById(sessionId)
//         .select("presentations")
//         .exec((err, presentations) => {
//         if(err || !presentations) {
//             return res.send({
//                 ok: false,
//                 message: 'Presentations not found'
//             });
//         }
//         return res.send({
//             ok: true,
//             data: presentations
//         });
//     });
// };
