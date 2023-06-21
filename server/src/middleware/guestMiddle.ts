
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { prisma } from '../config/prisma.server'
import { NextFunction, Request, Response } from 'express'
import { isObject } from '../utils/helpers'

// guard: auth-user
const guestGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  // token is in the rea.cookie
  const token: string = req.cookies.jwt

  if (token) {
    try {
      // decode the token
      const decoded: (string | JwtPayload | any) =
        jwt.verify(token, process.env.JWT_SECRET || '')

      // get the user and put it on req. object to access it in the route or the next middleware
      if (isObject(decoded)) {
        return res.status(401).json({
          error: 'only guest allowed'
        })
      }
    } catch (err: any) {
      // the token is not valid 
      next()
    }
  }
  else {
    next()
  }
}

export { guestGuard }