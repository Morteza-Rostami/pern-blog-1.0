
// handling error for routes does not exist:

import { NextFunction, Request, Response } from "express"

const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not found - ${req.originalUrl}`)
  res.status(404)
  // send the error to the next middleware
  next(error)
}

// general error handler
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // when we throw a menual error status might be still 200 : so: change it to 500
  let statusCode = res.statusCode === 200
    ? 500
    : res.statusCode
  let message = err.message

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
  })
}

export { notFound, errorHandler }