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
const UserService_1 = __importDefault(require("./UserService"));
const authMiddle_1 = require("../../middleware/authMiddle");
const router = express_1.default.Router();
// Get: all posts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield UserService_1.default.gets();
        return res.status(200).json(users);
    }
    catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}));
// Get: one post (profile)
// auth user: 
router
    .route('/:id')
    .get(authMiddle_1.authGuard, (req, res) => {
    const user = req.user;
    return res.status(200).json(user);
});
// Post: create
router.post('/create', (req, res) => {
    return UserService_1.default.create(req, res);
});
// Update: one post
router.put('/update/:id', (req, res) => {
});
// Update: one post
router.delete('/delete/:id', (req, res) => {
});
exports.default = router;
