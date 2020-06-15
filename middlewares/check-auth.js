const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers.authorization.substring(7);
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        console.log(decoded);
        req.userData = decoded;
        next();
    } catch (e) {
        res.status(404).json({
            message: 'Invalid token'
        })
    }
};
