'use strict';

const route = require('express').Router();
const auth = require('../../core/auth/auth.service');
const controller = require('./controller');

route
    .post('/', controller.newProduct)
    .put('/:productId', controller.updateProduct)
    .delete('/:productId', controller.deleteProduct)
    .get('/:productId', controller.getProductById)
    .get('/', controller.getAllProducts);

module.exports = route;
