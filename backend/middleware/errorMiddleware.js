const errorHandler = (err, req, res, next) => {
    // If a status code is already set, use that, else use 500
    const statusCode = res.statusCode ? res.statusCode : 500
    res.status(statusCode)

    // process.env.NODE_ENV can be either productions or development
    // If in production (live environment) hide the sensitive data with null
    // If only in development show the full error stack
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
}

module.exports = {
    errorHandler,
}