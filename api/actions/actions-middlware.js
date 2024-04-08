// add middlewares here related to actions
const rateLimit = require('express-rate-limit');

// Define rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: "Too many requests from this IP, please try again later"
});

const errorHandler = async (err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500; // Use error status if set, otherwise default to 500
    res.status(status).json({
        message: err.message || "Internal server error",
        stack: err.stack,
    });
};

module.exports = {
    limiter,
    errorHandler
};
