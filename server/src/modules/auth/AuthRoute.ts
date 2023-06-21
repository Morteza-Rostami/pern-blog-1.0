import express, { Request, Response, Router } from 'express'
import authService from './AuthService';
import { req_login, req_user } from '../../types/types';
import { guestGuard } from '../../middleware/guestMiddle';

const router: Router = express.Router();

// public: post: /users/login
router
  .route('/login')
  .post(
    guestGuard,
    (req: Request, res: Response) => {
      try {
        const {
          email,
          password,
        }: req_login = req.body

        if (!email || !password) {
          return res.status(400).json({
            error: 'invalid input'
          })
        }

        // login user
        authService.login(res, { email, password })
      } catch (err: any) {
        return res.status(500).json({
          error: err
        })
      }
    })

// public: post: /users/register
router
  .route('/register')
  .post(
    guestGuard,
    (req: Request, res: Response) => {
      try {
        const {
          name,
          email,
          password
        }: req_user = req.body

        if (!name || !email || !password) {
          return res.status(400).json({
            error: 'invalid input'
          })
        }

        // register user and send response
        authService.register({ name, email, password }, res)
      } catch (err: any) {
        return res.status(500).json({
          error: err
        })
      }
    })

// private: authUser: /users/logout 
router.post('/logout', (req, res) => {
  try {
    authService.logout(res)
  } catch (err: any) {
    return res.status(500).json({
      error: err
    })
  }
})

export default router