const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');

const router = express.Router();

router.use(morgan('dev'));
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods',
            'GET, PUT, POST, DELETE, OPTIONS');
        return res.status(200).json({});
    }
    next();
})

router.use('/user', userRoutes);
router.use('/order', orderRoutes);


router.use((req, res, next) => {
   const error = new Error('Not Found Endpoint');
   error.status = 404;
   next(error);
});

router.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
})

module.exports = router;
