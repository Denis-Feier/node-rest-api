const mongoose = require('mongoose');
const Bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

module.exports.signUp = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email})
        .exec()
        .then(result => {
            if (result.length >= 1) {
                res.status(409).json({
                    message: 'Email exists'
                });
            } else {
                Bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        res.status(500).json({
                            error: err
                        });
                    } else {

                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: email,
                            password: hash
                        });

                        user.save()
                            .then(user => {
                                res.status(201).json({
                                    message: 'User created',
                                    data: user
                                });
                            })
                            .catch(error => {
                                res.status(500).json({error});
                            });
                    }
                });
            }
        })
        .catch(error => {
            res.status(500).json({error});
        })
};

module.exports.killUserById = (req, res, next) => {
    const id = req.params.userId;
    User.findById(id)
        .exec()
        .then(doc => {
            if (!doc)
                res.status(404).json({
                    message: 'User not found for id: ' + id
                });
            else {
                return User.remove({_id: id}).exec()
            }
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
};

module.exports.getAllUser = (req, res, next) => {
    User.find()
        .exec()
        .then(doc => {
            res.status(200).json({
                message: 'Get all users',
                data: doc
            });
        })
        .catch(err => {
            res.status(500).json(err);
        });
};

module.exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.find({email: email})
        .exec()
        .then(doc => {
            if (doc.length === 1) {
                return Bcrypt.compare(password, doc[0].password)
                    .then(result => {
                        if (result) {
                            const token = jwt.sign({
                                    email: doc[0].email,
                                    _id: doc[0]._id
                                },
                                process.env.SECRET,
                                {
                                    expiresIn: '10h'
                                });
                            res.status(201).json({
                                message: 'Auth works',
                                token: token
                            })
                        } else {
                            res.status(500).json({
                                message: 'Auth Failed',
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: 'Auth Failed'
                        });
                    })
            }
            res.status(500).json({
                message: 'Auth Failed'
            });
        })
        .catch(err => {
            res.status(500).json({
                message: 'Auth Failed'
            });
        });
};
