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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_server_1 = require("../../config/prisma.server");
const userService = {
    gets: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield prisma_server_1.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true
                }
            });
            return users;
        });
    },
    // get one user
    get: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            // get the user from db
            const user = yield prisma_server_1.prisma.user.findUnique({
                where: {
                    id: id
                }
            });
            return user;
        });
    },
    create: function (req, res) {
        // body.post
        // create a new post
        // return new post
    },
    update: function (req, res) {
    },
    delete: function (req, res) {
    },
};
exports.default = userService;
