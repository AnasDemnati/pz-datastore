'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DepartureSchema = new Schema({
    tripCode: String,
    userCodeID: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    productCodeID: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    startingDate: Date,
    endingDate: Date,
    numberOfPax: String,
    accounts: [{
        dayNumber: Number,
        date: Date,
        description: String,
        budgetCurrency: {
            type: String,
            // enum: ['Eur'],
            default: 'Eur'
        },
        budgetAmount: String,
        actualCurrency: {
            type: String,
            // enum: ['Eur'],
            default: 'Eur'
        },
        actualAmount: String,
        affectedBudget: Boolean,
        comment: String,
        expenseCategory: {
            type: String,
            // enum: ['Cash given'],
            default: 'Cash given'
        },
        paymentType: {
            type: String,
            // enum: ['CC'],
            default: 'CC'
        },
        cashBalance: Number,
        altUserCodeID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        altTripCodeID: {
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
