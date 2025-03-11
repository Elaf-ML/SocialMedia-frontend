"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const postController_1 = require("../controllers/postController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Route to create a new post
router.post('/', authMiddleware_1.default, postController_1.createPost);
// Route to get all posts
router.get('/', postController_1.getPosts);
// Route to update a post
router.put('/:id', authMiddleware_1.default, postController_1.updatePost);
// Route to delete a post
router.delete('/:id', authMiddleware_1.default, postController_1.deletePost);
exports.default = router;
