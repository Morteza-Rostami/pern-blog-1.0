import type { User } from '@prisma/client'
import { prisma } from '../../config/prisma.server'
import { res_user } from '../../types/types'

const userService = {

  gets: async function (): Promise<res_user[]> {
    const users: res_user[] = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    })
    return users
  },

  // get one user
  get: async function (id: string) {
    // get the user from db
    const user = await prisma.user.findUnique({
      where: {
        id: id
      }
    })
    return user
  },

  create: function (req: any, res: any) {
    // body.post

    // create a new post

    // return new post

  },

  update: function (req: any, res: any) {

  },

  delete: function (req: any, res: any) {

  },

}

export default userService