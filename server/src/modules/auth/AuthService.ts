import type { User } from '@prisma/client'
import { prisma } from '../../config/prisma.server'
import { Request, Response } from 'express'
import { res_user, req_user, res_register, req_login } from '../../types/types'
import bcrypt from 'bcryptjs'
import generateToken from '../../utils/generateToken'

const authService = {

  // login user
  login: async function (res: Response, user: req_login) {
    let {
      email,
      password,
    }: req_login = user

    // check if: email and password are provided
    if (!email && !password) {
      return res.status(401).json({
        error: 'email or password are not provided!'
      })
    }

    // email can be uppercase
    email = email.toLowerCase()

    // get user
    const oldUser: User | null = await prisma.user.findUnique({
      where: {
        email: email,
      },
    })
    console.log('login')
    // if: user exist or not
    if (!oldUser) {
      return res.status(401).json({
        error: 'user does not exist.'
      })
    }

    // compare passwords:
    const passwordMatch: boolean =
      await bcrypt.compare(password, oldUser.password)

    // wrong password
    if (!passwordMatch) {
      return res.status(401).json({
        error: 'wrong password.'
      })
    }

    // generate token and store it on the cookie:
    generateToken(res, oldUser)

    // response:
    const response: res_user = {
      id: oldUser.id,
      name: oldUser.name,
      email: oldUser.email,
      createdAt: oldUser.createdAt
    }

    // login failed
    return res.status(200).json(response)
  },

  // register user
  register: async function ({
    name,
    email,
    password,
  }: req_user,
    res: Response) {

    // email is always lowercase
    email = email.toLowerCase()

    // if: user already exist

    const oldUser: User | null = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (oldUser) {
      // client error
      return res.status(400).json({
        error: 'user already exists.'
      })
    }

    // hash the password
    const salt: string = await bcrypt.genSalt(10)
    const hash: string = await bcrypt.hash(password, salt)

    // create new user
    const newUser: User = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hash
      }
    })

    if (newUser) {

      const response: res_register = {
        success: true,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt,
        }
      }
      // 201: resource wat successfuly created
      return res.status(201).json(response)

    } else {
      // req_user dat was wrong
      return res.status(400).json({
        error: 'invalid user data.'
      })
    }

  },

  // logout
  logout: function (res: Response) {
    // remove the cookie and send it with new response
    res.cookie('jwt', '', {
      httpOnly: true,
      // expires emmidiately
      expires: new Date(0),
    })

    return res.status(200).json({
      message: 'user logged out.',
    })
  }
}

export default authService