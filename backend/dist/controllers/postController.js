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
exports.deletePost = exports.updatePost = exports.getPosts = exports.createPost = void 0;
const postModel_1 = __importDefault(require("../models/postModel"));
require("../../types/express"); // Import the custom Request interface
// Create a new post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const post = new postModel_1.default({
        title,
        content,
        author: req.user._id,
        votes: 0,
    });
    try {
        const savedPost = yield post.save();
        res.status(201).json(savedPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
});
exports.createPost = createPost;
// Get all posts
const getPosts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield postModel_1.default.find().populate('author', 'username').sort({ votes: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});
exports.getPosts = getPosts;
// Update a post
const updatePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content } = req.body;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post || (post.author.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }
        post.title = title;
        post.content = content;
        const updatedPost = yield post.save();
        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
});
exports.updatePost = updatePost;
// Delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield postModel_1.default.findById(id);
        if (!post || (post.author.toString() !== req.user._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }
        yield post.remove();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting post', error });
    }
});
exports.deletePost = deletePost;
