"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPosts = exports.isObject = void 0;
function isObject(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
exports.isObject = isObject;
function editPosts(posts, req) {
    //http://${req.get('host')}/images/1686427429327--Top-10-Highest-paid-female-models-in-India.jpg
    if (posts.length) {
        const edited = posts.map((post) => (Object.assign(Object.assign({}, post), { imgUrl: `http://${req.get('host')}/images/${post.imgUrl}` })));
        return edited;
    }
    return posts;
}
exports.editPosts = editPosts;
