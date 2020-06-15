const Order = require('../models/order.model');
const Product = require('../models/product.model');

const mongoose = require('mongoose');

module.exports.getAllOrders = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name productImage')
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Get all orders',
                count: result.length,
                product: result.map(doc => {
                    return {
                        product: {
                            data: doc.product,
                            request: {
                                method: 'GET',
                                url: 'http://localhost:4200/product' + doc._id
                            },
                        },
                        quantity: doc.quantity,
                    };
                })
            });
        })
        .catch(err => {
            res.status(500).json(err);
        })
};

module.exports.getOrderByID = (req, res, next) => {
    const orderID = req.params.Id;
    Order.findById(orderID)
        .exec()
        .then(result => {
            console.log('From database: ' + result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'No valid object find for id: ' + orderID
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.postOrder = (req, res, next) => {
    const body = req.body;
    Product.findById(body.product)
        .exec()
        .then(doc => {
            if (!doc)
                res.status(404).json({
                    message: 'Product not found for id: ' + body.product
                })
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                product: body.product,
                quantity: body.quantity
            });
            return order.save()
        })
        .then(result => {
            res.status(201).json({
                message: 'Post order request',
                postData: {
                    quantity: result.quantity,
                    product: result.product
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
};

module.exports.deleteOrderByID = (req, res, next) => {
    const id = req.params.Id;
    Order.findById(id)
        .exec()
        .then(doc => {
            if (!doc)
                res.status(404).json({
                    message: 'Order not found for id: ' + id
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
}
