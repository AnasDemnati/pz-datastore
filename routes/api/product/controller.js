'use strict';

const Product = require('../../../models/product');
const User = require('../../../models/user');

exports.validateProduct = (req, res, next) => {
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

exports.newProduct = (req, res, next) => {
    let product = new Product({
        productCode: req.body.productCode,
        brandName: req.body.brandName,
        region: req.body.region,
        costingSheet: req.body.costingSheet,
        tripLength: req.body.tripLength,
        totalPax: req.body.totalPax,
        created: new Date()
    });

    product.save((err) => {
        if(err) {
            return res.send({
                ok: false,
                message: 'Error in product creation'
            });
        }
        return res.send({
            ok: true,
            message: 'Product created'
        });
    });
};

exports.updateProduct = (req, res, next) => {
    let productId = req.params.productId;

    Product.findById(productId)
        .exec((err, product) => {
        if(err || !product) {
            return res.send({
                ok: false,
                message: 'Product not found'
            });
        }

        product.productCode = req.body.productCode || product.productCode;
        product.brandName = req.body.brandName || product.brandName;
        product.region = req.body.region || product.region;
        product.costingSheet = req.body.costingSheet || product.costingSheet;
        product.tripLength = req.body.tripLength || product.tripLength;
        product.totalPax = req.body.totalPax || product.totalPax;
        product.updated = new Date();

        product.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while updating product'
                });
            }
            return res.send({
                ok: true,
                data: product
            });
        });
    });
};

exports.deleteProduct = (req, res, next) => {
    let productId = req.params.productId;

    Product.findById(productId)
        .exec((err, product) => {
        if(err || !product) {
            return res.send({
                ok: false,
                message: 'Product not found'
            });
        }
            product.deleted = true;
            product.updated = new Date();

            product.save((err) => {
                if(err) {
                    return res.send({
                        ok: false,
                        message: 'Error while deleting product'
                    });
                }
                return res.send({
                    ok: true,
                    data: product
                });
            });
    });
};

exports.getProductById = (req, res, next) => {
    let productId = req.params.productId;

    Product.findById(productId)
        .exec((err, product) => {
        if(err || !product) {
            return res.send({
                ok: false,
                message: 'Product not found'
            });
        }
        return res.send({
            ok: true,
            data: product
        });
    });
};

exports.getAllProducts = (req, res, next) => {

    Product.find({})
        .exec((err, products) => {
        if(err || !products) {
            return res.send({
                ok: false,
                message: 'Products not found'
            });
        }
        return res.send({
            ok: true,
            data: products
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
