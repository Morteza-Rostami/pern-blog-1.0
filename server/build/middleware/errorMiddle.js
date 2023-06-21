"use strict";
// handling error for routes does not exist:
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.notFound = void 0;
const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    res.status(404);
    // send the error to the next middleware
    next(error);
};
exports.notFound = notFound;
// general error handler
const errorHandler = (err, req, res, next) => {
    // when we throw a menual error status might be still 200 : so: change it to 500
    let statusCode = res.statusCode === 200
        ? 500
        : res.statusCode;
    let message = err.message;
    // this error is for if: using mongoose
    /* if (err.name === 'CastError' && err.kind === 'ObjectId') {
      statusCode = 404
      message = 'resource not found'
    } */
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === 'production'
            ? null
            : err.stack
    });
};
exports.errorHandler = errorHandler;
