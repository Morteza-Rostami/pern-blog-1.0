"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const PostService_1 = __importDefault(require("./PostService"));
const imgUploadMiddle_1 = __importDefault(require("../../middleware/imgUploadMiddle"));
const authMiddle_1 = require("../../middleware/authMiddle");
const router = express_1.default.Router();
// Get: all posts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        PostService_1.default.gets(req, res);
    }
    catch (err) {
        return res.status(400).json({
            error: err
        });
    }
}));
// /posts/:tag-name
router
    .route('/tags/:tag')
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        PostService_1.default.getByTag(req, res);
    }
    catch (err) {
        return res.status(400).json({
            error: err
        });
    }
}));
// Get: one post
router
    .route('/:id')
    .get((req, res) => {
    try {
        PostService_1.default.get(req.params, res, req);
    }
    catch (err) {
        return res.status(400).json({
            error: err
        });
    }
});
// Post: create
router
    .route('/create')
    .post(authMiddle_1.authGuard, imgUploadMiddle_1.default.single('image'), (req, res) => {
    // uploaded file
    if (req.file) {
        PostService_1.default.create(req, res, req.file);
    }
    else {
        return res.status(500).json({
            error: 'uploading image failed.'
        });
    }
    //return postService.create(req, res)
});
// Update: one post
router.put('/update/:id', (req, res) => {
});
// Update: one post
router.delete('/delete/:id', (req, res) => {
});
exports.default = router;
