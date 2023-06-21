
import jwt, { Jwt, JwtPayload } from 'jsonwebtoken'
import { prisma } from '../config/prisma.server'
import { NextFunction, Request, Response } from 'express'
import { isObject } from '../utils/helpers'

// guard: auth-user
const authGuard = async (
  req: any,
  res: Response,
  next: NextFunction
) => {

  // token is in the rea.cookie
  const token: string = req.cookies.jwt
  console.log('token:: ', token, req.cookies)
  if (token) {
    try {
      // decode the token
      const decoded: (string | JwtPayload | any) =
        jwt.verify(token, process.env.JWT_SECRET || '')

      // get the user and put it on req. object to access it in the route or the next middleware
      if (isObject(decoded)) {
        req.user = await prisma.user.findUnique({
          where: {
            id: decoded.id
          },
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          }
        })
      }
      next()
    } catch (err: any) {
      // the token is not valid 
      return res.status(401).json({
        error: 'not authorized, invalid token.'
      })
    }
  }
  else {
    // token does not exist in the request
    return res.status(401).json({
      error: 'not authorized, no token.'
    })
  }

}

export { authGuard }