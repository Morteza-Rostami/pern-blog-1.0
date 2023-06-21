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
const slugify_1 = __importDefault(require("slugify"));
const helpers_1 = require("../../utils/helpers");
const postService = {
    gets: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.query.limit || !req.query.page) {
                return res.status(400).json({
                    error: 'invalid input'
                });
            }
            const queries = {
                limit: parseInt(req.query.limit),
                page: parseInt(req.query.page),
            };
            console.log('queries: ', queries);
            const skip = (queries.page - 1) * queries.limit;
            const posts = yield prisma_server_1.prisma.post.findMany({
                skip,
                take: queries.limit,
                orderBy: { createdAt: 'desc' },
                include: { tags: true, author: true }
            });
            const totalPosts = yield prisma_server_1.prisma.post.count();
            const totalPages = Math.ceil(totalPosts / queries.limit);
            const nextPage = queries.page < totalPages
                ? queries.page + 1
                : null;
            // edit: imgUrl
            const editedPosts = (0, helpers_1.editPosts)(posts, req);
            const response = {
                posts: editedPosts,
                nextPage: nextPage,
                totalPages: totalPages
            };
            return res.status(200).json(response);
        });
    },
    getByTag: function (req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { tag } = req.params;
            /* const {
              limit = 20,
              page = 1
            }: {
              limit: any, page: any
            } = req.query as unknown as { limit: number, page: number } */
            const queries = {
                limit: parseInt(req.query.limit),
                page: parseInt(req.query.page),
            };
            const skip = (queries.page - 1) * queries.limit;
            // get all the post by tag-name in paginated way
            const posts = yield prisma_server_1.prisma.post.findMany({
                // how many record to skip to get the next paginated page
                skip,
                take: queries.limit,
                orderBy: { createdAt: 'desc' },
                // get posts by tag
                where: {
                    tags: {
                        some: {
                            name: tag
                        }
                    }
                },
                include: { tags: true }
            });
            return res.status(200).json(posts);
        });
    },
    get: function (params, res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = params;
            if (!id) {
                return res.status(400).json({
                    error: 'invalid input'
                });
            }
            const post = yield prisma_server_1.prisma.post.findUnique({
                where: {
                    id: id
                },
                include: {
                    tags: true,
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            createdAt: true,
                            updatedAt: true
                        }
                    }
                }
            });
            if (!post) {
                return res.status(401).json({
                    error: 'resource does not exist!'
                });
            }
            // edit post.imgUrl
            const editedPost = Object.assign(Object.assign({}, post), { imgUrl: `http://${req.get('host')}/images/${post.imgUrl}` });
            return res.status(200).json(editedPost);
        });
    },
    create: function (req, res, file) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, body, userId, tags } = req.body;
            if (!title || !body || !userId || !tags.length) {
                return res.status(401).json({
                    error: 'user inputs are missing!'
                });
            }
            //tags = "tag1, tag2, tag3"
            // convert: tags_json string to array of objects.
            const tagsArr = tags.split(",").map((tag) => ({ name: tag }));
            // create tags if they don't exist:
            const createdTags = yield Promise.all(tagsArr.map((tag) => __awaiter(this, void 0, void 0, function* () {
                // check if tag already has been created:
                const oldTag = yield prisma_server_1.prisma.tag.findUnique({
                    where: {
                        name: tag.name
                    }
                });
                // if old tag exist
                if (oldTag) {
                    return oldTag;
                }
                else {
                    // remove epecial characters:
                    const tagName = tag.name.replace(/[^a-zA-Z0-9\s]/g, "");
                    console.log('_________', tagName);
                    // create a new tag
                    return yield prisma_server_1.prisma.tag.create({
                        data: {
                            name: tag.name,
                            slug: (0, slugify_1.default)(tagName, { lower: true, strict: true })
                        },
                    });
                }
            })));
            // tags with just id
            const postTags = createdTags.map((tag) => ({ id: tag.id }));
            // create a post: 
            const newPost = yield prisma_server_1.prisma.post.create({
                data: {
                    title: title,
                    body: body,
                    imgUrl: file.filename,
                    // rel: post has a user
                    author: {
                        connect: {
                            id: userId,
                        }
                    },
                    // rel: post has tags
                    tags: {
                        connect: postTags
                    }
                }
            });
            if (newPost) {
                // body.post
                return res.status(200).json(newPost);
            }
            else {
                return res.status(400).json({
                    error: "can't create the post."
                });
            }
        });
    },
    update: function (req, res) {
    },
    delete: function (req, res) {
    },
};
exports.default = postService;
