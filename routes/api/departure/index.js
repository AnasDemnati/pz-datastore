'use strict';

const route = require('express').Router();
const auth = require('../../core/auth/auth.service');
const controller = require('./controller');

route
    .post('/', controller.newDeparture)
    .put('/:departureId', controller.updateDeparture)
    .put('/accounts/:departureId', controller.updateDepartureAccounts)
    .delete('/:departureId', controller.deleteDeparture)
    .get('/:departureId', controller.getDepartureById)
    .get('/', controller.getAllDepartures);
    // .get('/congres/:congreId', controller.getSessionsByCongre)
//    .get('/presentations/:presentationId', controller.getPresentationById)
    // .get('/:sessionId/presentations', controller.getPresentationsBySession);

module.exports = route;
