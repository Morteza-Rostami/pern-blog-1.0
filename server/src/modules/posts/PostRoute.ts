import express, { Request, Response, Router } from 'express'
import postService from './PostService';
import uploadImg from '../../middleware/imgUploadMiddle';
import type { Post } from '@prisma/client';
import { prisma } from '../../config/prisma.server';
import { authGuard } from '../../middleware/authMiddle';

const router: Router = express.Router();

// Get: all posts
router.get('/', async (req: Request, res: Response) => {

  try {
    postService.gets(req, res)
  } catch (err: any) {
    return res.status(400).json({
      error: err
    })
  }
})

// /posts/:tag-name
router
  .route('/tags/:tag')
  .get(async (req: Request, res: Response) => {
    try {
      postService.getByTag(req, res)
    } catch (err: any) {
      return res.status(400).json({
        error: err
      })
    }
  })

// Get: one post
router
  .route('/:id')
  .get((req: Request, res: Response) => {
    try {
      postService.get(req.params, res, req)
    } catch (err: any) {
      return res.status(400).json({
        error: err
      })
    }
  })

// Post: create
router
  .route('/create')
  .post(
    authGuard,
    uploadImg.single('image'),
    (req: Request, res: Response) => {

      // uploaded file
      if (req.file) {
        postService.create(req, res, req.file)
      } else {
        return res.status(500).json({
          error: 'uploading image failed.'
        })
      }
      //return postService.create(req, res)
    })

// Update: one post
router.put('/update/:id', (req, res) => {

})

// Update: one post
router.delete('/delete/:id', (req, res) => {

})

export default router