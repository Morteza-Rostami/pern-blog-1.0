"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthService_1 = __importDefault(require("./AuthService"));
const guestMiddle_1 = require("../../middleware/guestMiddle");
const router = express_1.default.Router();
// public: post: /users/login
router
    .route('/login')
    .post(guestMiddle_1.guestGuard, (req, res) => {
    try {
        const { email, password, } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'invalid input'
            });
        }
        // login user
        AuthService_1.default.login(res, { email, password });
    }
    catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});
// public: post: /users/register
router
    .route('/register')
    .post(guestMiddle_1.guestGuard, (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'invalid input'
            });
        }
        // register user and send response
        AuthService_1.default.register({ name, email, password }, res);
    }
    catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});
// private: authUser: /users/logout 
router.post('/logout', (req, res) => {
    try {
        AuthService_1.default.logout(res);
    }
    catch (err) {
        return res.status(500).json({
            error: err
        });
    }
});
exports.default = router;
