
// generate jwt token

import jwt from 'jsonwebtoken'
import type { User } from "@prisma/client";
import { Response } from "express";
import { token_payload } from '../types/types';

function generateToken(res: Response, user: User): any {
  const jwtSercret: (string | undefined) = process.env.JWT_SECRET
  const payload: token_payload = {
    id: user.id,
    email: user.email
  }
  let token: string = ''

  // env.jwtSecret might be undefined
  if (jwtSercret) {
    // args: payload to store in token, jwt secret, options
    token = jwt.sign(payload, jwtSercret, { expiresIn: '365d' })
  }

  // store the token in cookie:
  res.cookie('jwt', token, {
    httpOnly: true,
    // return true if: not in development
    secure: process.env.NODE_ENV !== 'development',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  })
}

export default generateToken