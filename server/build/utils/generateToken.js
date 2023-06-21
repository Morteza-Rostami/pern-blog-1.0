"use strict";
// generate jwt token
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(res, user) {
    const jwtSercret = process.env.JWT_SECRET;
    const payload = {
        id: user.id,
        email: user.email
    };
    let token = '';
    // env.jwtSecret might be undefined
    if (jwtSercret) {
        // args: payload to store in token, jwt secret, options
        token = jsonwebtoken_1.default.sign(payload, jwtSercret, { expiresIn: '365d' });
    }
    // store the token in cookie:
    res.cookie('jwt', token, {
        httpOnly: true,
        // return true if: not in development
        secure: process.env.NODE_ENV !== 'development',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
}
exports.default = generateToken;
