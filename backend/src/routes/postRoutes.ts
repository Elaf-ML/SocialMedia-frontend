import express from 'express';
import { createPost, getPosts, updatePost, deletePost, likePost, createComment, deleteComment, updateComment, AuthPosts, getLikedPosts } from '../controllers/postController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Route to create a new post
router.post('/createPost', authMiddleware, createPost);

// Route to get all posts
router.get('/getPosts', getPosts);
router.get('/myPosts', authMiddleware, AuthPosts);
router.get('/likedPosts', authMiddleware, getLikedPosts);

// Route to update a post
router.put('/updatePost/:id', authMiddleware, updatePost);

// Route to delete a postb
router.delete('/deletePost/:id', authMiddleware, deletePost);

// Route to like a post
router.post('/likePost/:id', authMiddleware, likePost);

// Route to create a comment
router.post('/Comment/:id', authMiddleware, createComment);

// Route to delete a comment
router.delete('/DeleteComment/:postId/:commentId', authMiddleware, deleteComment);

// Route to update a comment
router.put('/UpdateComment/:postId/:commentId', authMiddleware, updateComment);

export default router;