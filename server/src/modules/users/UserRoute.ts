import express, { Request, Response, Router } from 'express'
import userService from './UserService';
import { res_user } from '../../types/types'
import { authGuard } from '../../middleware/authMiddle';

const router: Router = express.Router();

// Get: all posts
router.get('/', async (req: any, res: any) => {

  try {
    const users: res_user[] = await userService.gets()
    return res.status(200).json(users)
  } catch (err: any) {
    return res.status(500).json({
      error: err
    })
  }

})

// Get: one post (profile)
// auth user: 
router
  .route('/:id')
  .get(
    authGuard,
    (req: any, res: Response) => {
      const user = req.user
      return res.status(200).json(user)
    })

// Post: create
router.post('/create', (req, res) => {
  return userService.create(req, res)
})

// Update: one post
router.put('/update/:id', (req, res) => {

})

// Update: one post
router.delete('/delete/:id', (req, res) => {

})

export default router