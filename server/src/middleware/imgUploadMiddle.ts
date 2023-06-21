
import { Request } from "express";
import multer from "multer";
import path from 'path'

// setting storage engine
const storageEngine = multer.diskStorage({
  destination: './public/images',
  filename: (req: Request, file: any, cb: Function) => {
    cb(null, `${Date.now()}--${file.originalname}`)
  }
})

// filter for what file types are allowed
function checkFileType(file: any, cb: Function) {
  // regular expression
  const fileTypes = /jpeg|jpg|png|gif|svg|webp/

  // check file extensions .jpg
  const extName: boolean =
    fileTypes.test(path.extname(file.originalname).toLowerCase())

  /* 
  Checking the extension name alone is not enough, as extension names can be easily edited.
  MIME type is a string that specifies the type of data that a file contains, while file extension is a string of characters that follows the last dot in a file name and indicates the file's format
  */
  const mimeType: boolean =
    fileTypes.test(file.mimetype)

  // if both mimetype and file extension .jpg are right.
  if (mimeType && extName) {
    return cb(null, true)
  }
  else {
    cb('Error: you can only upload images!')
  }
}

// middleware: initialize multer
// multipart/form-data
const uploadImg = multer({
  storage: storageEngine,
  // file size limit: 1mb
  limits: { fileSize: 1000000 },
  // filed allowed
  fileFilter: (req: Request, file: any, cb) => {
    checkFileType(file, cb)
  }
})

export default uploadImg



