"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
let prisma;
if (!global.__db) {
    global.__db = new client_1.PrismaClient;
}
exports.prisma = prisma = global.__db;
