const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({
        message: 'Order Get works'
    })
});

router.post('/', (req, res, next) => {
    const body = req.body;
    res.json(body);
});

module.exports = router;
