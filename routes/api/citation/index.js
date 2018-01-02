'use strict';

const express = require('express');
const route = express.Router();

const citationController = require('./citation.controller');

route.post('/jsonData/', citationController.getJsonData);

// route.get('/citations/', citationController.getCitations);
//
// route.get('/citations/:id', citationController.getCitationById);
//
// route.post('/citations/', citationController.newCitation);
//
// route.put('/citations/:id', citationController.updateCitation);
//
// route.delete('/citations/:id', citationController.deleteCitation);
//
// route.get('/citations-authors', citationController.getCitationAuthors);


module.exports = route;
