'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const leaderAccountSystemDB = require('../config-db').leaderAccountSystemDB;

const ProductSchema = new Schema({
    productCode: String,
    brandName: String,
    region: String,
    costingSheet: [],
    tripLength: Number,
    totalPax: Number,
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

module.exports = leaderAccountSystemDB.model('Product', ProductSchema);
