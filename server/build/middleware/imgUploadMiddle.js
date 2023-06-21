"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// setting storage engine
const storageEngine = multer_1.default.diskStorage({
    destination: './public/images',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}--${file.originalname}`);
    }
});
// filter for what file types are allowed
function checkFileType(file, cb) {
    // regular expression
    const fileTypes = /jpeg|jpg|png|gif|svg|webp/;
    // check file extensions .jpg
    const extName = fileTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    /*
    Checking the extension name alone is not enough, as extension names can be easily edited.
    MIME type is a string that specifies the type of data that a file contains, while file extension is a string of characters that follows the last dot in a file name and indicates the file's format
    */
    const mimeType = fileTypes.test(file.mimetype);
    // if both mimetype and file extension .jpg are right.
    if (mimeType && extName) {
        return cb(null, true);
    }
    else {
        cb('Error: you can only upload images!');
    }
}
// middleware: initialize multer
// multipart/form-data
const uploadImg = (0, multer_1.default)({
    storage: storageEngine,
    // file size limit: 1mb
    limits: { fileSize: 1000000 },
    // filed allowed
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
});
exports.default = uploadImg;
