import express, { Application, Request, Response } from 'express';
import cookieParser from 'cookie-parser'

// routes
import postRoutes from './modules/posts/PostRoute'
import userRoutes from './modules/users/UserRoute'
import authRoutes from './modules/auth/AuthRoute'

import * as dotenv from 'dotenv'
import cors from 'cors'
import { errorHandler, notFound } from './middleware/errorMiddle';
import path from 'path';
dotenv.config()

let PORT: number = 3000
const app: Application = express();

if (process.env.PORT) {
  PORT = parseInt(process.env.PORT)
}

app.use(express.static('dist'))

// attach cors to app
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}))
// get json in our requests
app.use(express.json())
// get formData
app.use(express.urlencoded({
  extended: true
}))
// for parsing the cookie coming from the browser
app.use(cookieParser())
// serving static files
app.use(express.static('public'));

// call this middlewares on all routes:

/* app.use(notFound)
app.use(errorHandler) */

// register routes

app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)
app.use('/api/auth', authRoutes)

console.log(path.dirname(__dirname))
// wildcard: all other requests will be redirected to react-app
app.get("*", (req: Request, res: Response) => {
  return res.sendFile(path.join(path.dirname(__dirname), "dist", "index.html"))
})

app.listen(PORT, (): void => {
  console.log('SERVER IS UP ON PORT:', PORT);
});