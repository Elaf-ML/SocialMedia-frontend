"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const commentController_1 = require("../controllers/commentController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Route to create a comment
router.post('/:postId', authMiddleware_1.default, commentController_1.createComment);
// Route to delete a comment
router.delete('/:commentId', authMiddleware_1.default, commentController_1.deleteComment);
// Route to get comments for a specific post
router.get('/:postId', commentController_1.getCommentsForPost);
exports.default = router;
