const Product = require('../models/product.model');

const mongoose = require('mongoose');

module.exports.getAllProducts = (req, res, next) => {
    Product.find()
        .exec()
        .then(result => {
            res.status(200).json({
                    message: 'Get all products',
                    orders: result.map(doc => {
                        return {
                            _id: doc._id,
                            name: doc.name,
                            price: doc.price,
                            productImage: doc.productImage,
                            request: {
                                method: 'GET',
                                url: 'http://localhost:4200/product/' + doc._id
                            }
                        };
                    })
                }
            );
        })
        .catch(err => {
            res.status(500).json(err);
        })
};

module.exports.getProductById = (req, res, next) => {
    const id = req.params.Id;
    Product.findById(id)
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'No valid object find for id: ' + id
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

module.exports.postProduct = (req, res, next) => {
    const body = req.body;
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: body.name,
        price: body.price,
        productImage: req.file.path
    });
    product.save()
        .then(result => {
            res.status(201).json({
                message: 'Post order request',
                postData: {
                    _id: result._id,
                    name: result.name,
                    price: result.price,
                    productImage: 'my-uploads/' + result.productImage,
                    request: {
                        method: 'GET',
                        url: 'http://localhost:4200/product/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.updateProductById = (req, res, next) => {
    const id = req.params.Id;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (!doc)
                res.status(404).json({
                    message: 'Product not found for id: ' + id
                });
            else {
                return Product.update({_id: doc._id}, {
                    $set: {
                        name: req.body.name,
                        price: req.body.price
                    }
                }).exec()
            }
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

module.exports.deleteProductById = (req, res, next) => {
    const id = req.params.Id;
    Product.findById(id)
        .exec()
        .then(doc => {
            if (!doc)
                res.status(404).json({
                    message: 'Product not found for id: ' + id
                });
            else {
                return Product.remove({_id: id}).exec()
            }
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};
