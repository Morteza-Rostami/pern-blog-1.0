import type { Post, Tag } from '@prisma/client'
import { prisma } from '../../config/prisma.server'
import { Request, Response } from 'express'
import slugify from 'slugify'
import { editPosts } from '../../utils/helpers'

const postService = {

  gets: async function (req: Request, res: Response) {

    if (!req.query.limit || !req.query.page) {
      return res.status(400).json({
        error: 'invalid input'
      })
    }

    const queries: {
      limit: number,
      page: number
    } = {
      limit: parseInt(req.query.limit as string),
      page: parseInt(req.query.page as string),
    }
    console.log('queries: ', queries)
    const skip: number = (queries.page - 1) * queries.limit

    const posts: Post[] = await prisma.post.findMany({
      skip,
      take: queries.limit,
      orderBy: { createdAt: 'desc' },
      include: { tags: true, author: true }
    })

    const totalPosts: number = await prisma.post.count()
    const totalPages: number = Math.ceil(totalPosts / queries.limit)
    const nextPage: (number | null) =
      queries.page < totalPages
        ? queries.page + 1
        : null

    // edit: imgUrl
    const editedPosts: Post[] = editPosts(posts, req)

    const response = {
      posts: editedPosts,
      nextPage: nextPage,
      totalPages: totalPages
    }

    return res.status(200).json(response)

  },

  getByTag: async function (req: Request, res: Response) {
    const { tag } = req.params
    /* const {
      limit = 20,
      page = 1
    }: {
      limit: any, page: any
    } = req.query as unknown as { limit: number, page: number } */
    const queries: {
      limit: number,
      page: number
    } = {
      limit: parseInt(req.query.limit as string),
      page: parseInt(req.query.page as string),
    }
    const skip: number = (queries.page - 1) * queries.limit

    // get all the post by tag-name in paginated way
    const posts: Post[] = await prisma.post.findMany({
      // how many record to skip to get the next paginated page
      skip,
      take: queries.limit,
      orderBy: { createdAt: 'desc' },
      // get posts by tag
      where: {
        tags: {
          some: {
            name: tag
          }
        }
      },
      include: { tags: true }
    })

    return res.status(200).json(posts)
  },

  get: async function (params: any, res: Response, req: Request) {
    const { id }: { id: string } = params

    if (!id) {
      return res.status(400).json({
        error: 'invalid input'
      })
    }

    const post: (Post | null) = await prisma.post.findUnique({
      where: {
        id: id
      },
      include: {
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true
          }
        }
      }
    })

    if (!post) {
      return res.status(401).json({
        error: 'resource does not exist!'
      })
    }

    // edit post.imgUrl
    const editedPost: Post = {
      ...post,
      imgUrl: `http://${req.get('host')}/images/${post.imgUrl}`
    }

    return res.status(200).json(editedPost)
  },

  create: async function (
    req: Request,
    res: Response,
    file: any
  ) {

    const {
      title,
      body,
      userId,
      tags
    }: {
      title: string,
      body: string,
      userId: string,
      tags: string
    } = req.body

    if (!title || !body || !userId || !tags.length) {
      return res.status(401).json({
        error: 'user inputs are missing!'
      })
    }

    //tags = "tag1, tag2, tag3"

    // convert: tags_json string to array of objects.
    const tagsArr: { name: string }[] =
      tags.split(",").map((tag) => ({ name: tag }))

    // create tags if they don't exist:
    const createdTags: Tag[] =
      await Promise.all(
        tagsArr.map(async (tag) => {
          // check if tag already has been created:
          const oldTag: (Tag | null) = await prisma.tag.findUnique({
            where: {
              name: tag.name
            }
          })

          // if old tag exist
          if (oldTag) {
            return oldTag
          } else {
            // remove epecial characters:
            const tagName: string = tag.name.replace(/[^a-zA-Z0-9\s]/g, "")
            console.log('_________', tagName)
            // create a new tag
            return await prisma.tag.create({
              data: {
                name: tag.name,
                slug: slugify(tagName, { lower: true, strict: true })
              },
            })
          }
        })
      )

    // tags with just id
    const postTags: { id: string }[] = createdTags.map((tag) => ({ id: tag.id }))

    // create a post: 
    const newPost: Post =
      await prisma.post.create({
        data: {
          title: title,
          body: body,
          imgUrl: file.filename,
          // rel: post has a user
          author: {
            connect: {
              id: userId,
            }
          },
          // rel: post has tags
          tags: {
            connect: postTags
          }
        }
      })

    if (newPost) {
      // body.post
      return res.status(200).json(newPost)
    }
    else {
      return res.status(400).json({
        error: "can't create the post."
      })
    }

  },

  update: function (req: any, res: any) {

  },

  delete: function (req: any, res: any) {

  },
}

export default postService