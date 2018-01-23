'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderAccountSystemDB = require('../config-db').leaderAccountSystemDB;

const AccountSchema = new Schema({
    startingDate: String,
    productReference: String,
    currency: String,
    numberOfPax: String,
    numberOfLeaders: String,
    deleted: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

module.exports = leaderAccountSystemDB.model('Account', AccountSchema);
