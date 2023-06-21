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
exports.guestGuard = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const helpers_1 = require("../utils/helpers");
// guard: auth-user
const guestGuard = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // token is in the rea.cookie
    const token = req.cookies.jwt;
    if (token) {
        try {
            // decode the token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
            // get the user and put it on req. object to access it in the route or the next middleware
            if ((0, helpers_1.isObject)(decoded)) {
                return res.status(401).json({
                    error: 'only guest allowed'
                });
            }
        }
        catch (err) {
            // the token is not valid 
            next();
        }
    }
    else {
        next();
    }
});
exports.guestGuard = guestGuard;
