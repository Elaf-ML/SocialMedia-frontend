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
exports.getCommentsForPost = exports.deleteComment = exports.createComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const commentModel_1 = __importDefault(require("../models/commentModel"));
const postModel_1 = __importDefault(require("../models/postModel"));
// Create a new comment
const createComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId, content } = req.body;
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id; // Assuming user ID is stored in req.user after authentication
    try {
        const comment = new commentModel_1.default({ content, author: userId, post: postId });
        yield comment.save();
        // Update the post with the new comment
        yield postModel_1.default.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
        res.status(201).json(comment);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating comment', error });
    }
});
exports.createComment = createComment;
// Delete a comment
const deleteComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commentId } = req.params;
    if (!req.user) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    try {
        const comment = yield commentModel_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        if (comment.author.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }
        yield commentModel_1.default.findByIdAndDelete(commentId);
        // Remove the comment reference from the associated post
        yield postModel_1.default.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });
        res.status(200).json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
});
exports.deleteComment = deleteComment;
// Fetch comments for a specific post
const getCommentsForPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { postId } = req.params;
    try {
        const comments = yield commentModel_1.default.find({ post: new mongoose_1.default.Types.ObjectId(postId) }).populate('author', 'username');
        res.status(200).json(comments);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching comments', error });
    }
});
exports.getCommentsForPost = getCommentsForPost;
