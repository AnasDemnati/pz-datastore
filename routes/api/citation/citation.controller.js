'use strict';

const Citation = require('../../../models/citation');
const excelReader = require('../../../excelReader');
var async = require('async');
var moment = require('moment');
// var node_xj = require("xls-to-json");

exports.getJsonData = (req, res) => {
  let startingDate = req.body.startingDate;
  let productReference = req.body.productReference;
  let currency = req.body.currency;
  let numberOfPax = req.body.numberOfPax;
  let numberOfLeaders = req.body.numberOfLeaders;

    if(!startingDate) {
        return res.send(402, {message: 'Starting date is required '});
    } else if(!productReference) {
        return res.send(402, {message: 'Product reference is required '});
    } else if(!currency) {
        return res.send(402, {message: 'Currency is required '});
    } else if(!numberOfPax) {
        return res.send(402, {message: 'Number of pax is required '});
    } else if(!numberOfLeaders) {
        return res.send(402, {message: 'Number of leaders is required '});
    } else {
    excelReader.filteredResult(productReference, function(filteredResultArray) {
      let searchResult = [];
      let index = 0;

      filteredResultArray.forEach((item) => {
        let startingDateformatted = moment(startingDate, moment.ISO_8601).add(item.DayNumber - 1, 'd').format("MM/DD/YYYY H:mm");

        searchResult.push({
          id : index,
          isDefault : true,
          saved : true,
          DayNumber : item.DayNumber,
          ItineraryDayDate : startingDateformatted,
          ElementTitle : item.ElementTitle,
          CurrencyCode : item.CurrencyCode,
          PaymentArrangementName : item.PaymentArrangementName,
          PaxCost : item['PaxCost_' + numberOfPax],
          LeaderCost : item['LeaderCost_' + numberOfLeaders],
          budgetAmount : (parseFloat(item['PaxCost_' + numberOfPax]) + parseFloat(item['LeaderCost_' + numberOfLeaders])).toFixed(2),
          actualBudgetAmount : 'N/A',
          actualBudgetCurrency : 'N/A'
        });
        index++;
      });

      return res.send(200, searchResult);
    });
  }
};

// var filterRecords = function(dataArray, filterColumn, filterCriteria) {
//   var filteredArray = [];
//   for(var arrayIte = 0; arrayIte < dataArray.length; arrayIte++) {
//     if (dataArray[arrayIte][filterColumn] !== filterCriteria) {
//       filteredArray.push(dataArray[arrayIte]);
//     }
//   }
//
//   return filteredArray;
// };

// Get all Citations
exports.getCitations = (req, res) => {
    Citation.find({}).exec((err, citations) => {
        if(err) {
            return res.send(500, {message: err.message});
        }

        return res.send(200, citations);
    });
};

// Get One proverb
exports.getCitationById = (req, res) => {
    let id = req.params.id;
    Citation.findOne({_id: id}).exec((err, citation) => {
        if(err) return res.send(500, {message: err.message});
        if(!citation) return res.send(404, {message: 'Citation not found'});
        return res.send(200, citation);
    });
};

// Create new Proverb
exports.newCitation = (req, res) => {
    let author = req.body.author || '';
    let quote = req.body.quote;

    if(!quote) {
        return res.send(402, {message: 'The citation quote is required '});
    } else {
        let citation = new Citation(req.body);

        citation.save((err, citation) => {
            if(err) return res.send(500, {message: err.message});

            return res.send(200, citation);
        });
    }
};

// Put Proverb
exports.updateCitation = (req, res) => {
    let id = req.params.id;

    Citation.findOne({_id: id}).exec((err, citation) => {
        if(err) return res.send(500, {message: err.message});
        if(!citation) return res.send(404, {message: 'Citation not found'});
        citation.author = req.body.author || citation.author;
        citation.quote = req.body.quote || citation.quote;

        citation.save((err, citation) => {
            if(err) return res.send(500, {message: err.message});

            return res.send(200, citation);
        });
    });
};

// Delete Proverb
exports.deleteCitation = (req, res) => {
    let id = req.params.id;

    Citation.remove({_id: id}).exec((err, citation) => {
        if(err)
            return res.send(500, {message: err.message});
        if(!citation)
            return res.send(404, {message: 'Citation not found'});
        return res.send(200, citation);
    });
};

exports.getCitationAuthors = (req, res) => {
    Citation.distinct('author', (err, authors) => {
        if(err) {
            return res.send(500, {message: err.message});
        }
        return res.send(200, authors);
    });
};
