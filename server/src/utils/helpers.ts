import type { Post } from "@prisma/client";
import { Request } from "express";

export function isObject(value: any) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function editPosts(
  posts: Post[],
  req: Request
) {
  //http://${req.get('host')}/images/1686427429327--Top-10-Highest-paid-female-models-in-India.jpg
  if (posts.length) {
    const edited = posts.map((post) => ({
      ...post, imgUrl: `http://${req.get('host')}/images/${post.imgUrl}`
    }))
    return edited
  }
  return posts
}