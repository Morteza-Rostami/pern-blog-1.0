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
const prisma_server_1 = require("../../config/prisma.server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateToken_1 = __importDefault(require("../../utils/generateToken"));
const authService = {
    // login user
    login: function (res, user) {
        return __awaiter(this, void 0, void 0, function* () {
            let { email, password, } = user;
            // check if: email and password are provided
            if (!email && !password) {
                return res.status(401).json({
                    error: 'email or password are not provided!'
                });
            }
            // email can be uppercase
            email = email.toLowerCase();
            // get user
            const oldUser = yield prisma_server_1.prisma.user.findUnique({
                where: {
                    email: email,
                },
            });
            console.log('login');
            // if: user exist or not
            if (!oldUser) {
                return res.status(401).json({
                    error: 'user does not exist.'
                });
            }
            // compare passwords:
            const passwordMatch = yield bcryptjs_1.default.compare(password, oldUser.password);
            // wrong password
            if (!passwordMatch) {
                return res.status(401).json({
                    error: 'wrong password.'
                });
            }
            // generate token and store it on the cookie:
            (0, generateToken_1.default)(res, oldUser);
            // response:
            const response = {
                id: oldUser.id,
                name: oldUser.name,
                email: oldUser.email,
                createdAt: oldUser.createdAt
            };
            // login failed
            return res.status(200).json(response);
        });
    },
    // register user
    register: function ({ name, email, password, }, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // email is always lowercase
            email = email.toLowerCase();
            // if: user already exist
            const oldUser = yield prisma_server_1.prisma.user.findUnique({
                where: {
                    email: email
                }
            });
            if (oldUser) {
                // client error
                return res.status(400).json({
                    error: 'user already exists.'
                });
            }
            // hash the password
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hash = yield bcryptjs_1.default.hash(password, salt);
            // create new user
            const newUser = yield prisma_server_1.prisma.user.create({
                data: {
                    name: name,
                    email: email,
                    password: hash
                }
            });
            if (newUser) {
                const response = {
                    success: true,
                    user: {
                        id: newUser.id,
                        name: newUser.name,
                        email: newUser.email,
                        createdAt: newUser.createdAt,
                    }
                };
                // 201: resource wat successfuly created
                return res.status(201).json(response);
            }
            else {
                // req_user dat was wrong
                return res.status(400).json({
                    error: 'invalid user data.'
                });
            }
        });
    },
    // logout
    logout: function (res) {
        // remove the cookie and send it with new response
        res.cookie('jwt', '', {
            httpOnly: true,
            // expires emmidiately
            expires: new Date(0),
        });
        return res.status(200).json({
            message: 'user logged out.',
        });
    }
};
exports.default = authService;
