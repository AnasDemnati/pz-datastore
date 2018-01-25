'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartureSchema = new Schema({
    tripCode: String,
    userCode: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productCode: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    startingDate: Date,
    endingDate: Date,
    numberOfPax: String,
    accounts: [{
        date: Date,
        description: String,
        budgetCurrency: {
            type: String,
            enum: ['Eur'],
            default: 'Eur'
        },
        budgetAmount: String,
        actualCurrency: {
            type: String,
            enum: ['Eur'],
            default: 'Eur'
        },
        actualAmount: String,
        affectedBudget: Boolean,
        comment: String,
        expenseCategory: {
            type: String,
            enum: ['Cash given'],
            default: 'Cash given'
        },
        paymentType: {
            type: String,
            enum: ['CC'],
            default: 'CC'
        },
        altUserCode: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        altTripCode: {
            type: Schema.Types.ObjectId,
            ref: 'Departure'
        },
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
    }],
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

module.exports = mongoose.model('Departure', DepartureSchema);
