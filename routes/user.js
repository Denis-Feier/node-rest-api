const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.json({
        message: `User Get works`
    })
});

router.get('/all', (req, res, next) => {
    res.json({
        message: 'User all Get works'
    })
});


router.post('/', (req, res, next) => {
    const body = req.body;
    res.json(body);
});

module.exports = router;
