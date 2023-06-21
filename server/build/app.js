"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// routes
const PostRoute_1 = __importDefault(require("./modules/posts/PostRoute"));
const UserRoute_1 = __importDefault(require("./modules/users/UserRoute"));
const AuthRoute_1 = __importDefault(require("./modules/auth/AuthRoute"));
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv.config();
let PORT = 3000;
const app = (0, express_1.default)();
if (process.env.PORT) {
    PORT = parseInt(process.env.PORT);
}
app.use(express_1.default.static('dist'));
// attach cors to app
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true
}));
// get json in our requests
app.use(express_1.default.json());
// get formData
app.use(express_1.default.urlencoded({
    extended: true
}));
// for parsing the cookie coming from the browser
app.use((0, cookie_parser_1.default)());
// serving static files
app.use(express_1.default.static('public'));
// call this middlewares on all routes:
/* app.use(notFound)
app.use(errorHandler) */
// register routes
app.use('/api/posts', PostRoute_1.default);
app.use('/api/users', UserRoute_1.default);
app.use('/api/auth', AuthRoute_1.default);
console.log(path_1.default.dirname(__dirname));
// wildcard: all other requests will be redirected to react-app
app.get("*", (req, res) => {
    return res.sendFile(path_1.default.join(path_1.default.dirname(__dirname), "dist", "index.html"));
});
app.listen(PORT, () => {
    console.log('SERVER IS UP ON PORT:', PORT);
});
