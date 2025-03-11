import { Request, Response } from 'express';
import Post from '../models/postModel';
import User from '../models/userModel';
import { updateLikedPosts } from './userController';
import mongoose from 'mongoose';



export const createPost = async (req: Request, res: Response) => {
    const { title, content, img } = req.body;
    const authorId = req.user._id;

    try {
        // Fetch the coverImg from the User model based on the author ID
        const author = await User.findById(authorId);
        if (!author) {
            return res.status(404).json({ message: 'Author not found' });
        }

        const coverImg = author.coverImg;

        const post = new Post({
            title,
            content,
            img,
            coverImg,
            author: authorId,
            votes: 0,
        });

        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error });
    }
};


export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate('author', 'username').sort({ votes: -1 });

        // Check and update coverImg for each post
        const updatedPosts = await Promise.all(posts.map(async (post: any) => {
            const author = await User.findById(post.author._id);
            if (author && post.coverImg !== author.coverImg) {
                post.coverImg = author.coverImg;
                await post.save();
            }
            return post;
        }));

        res.status(200).json(updatedPosts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

export const AuthPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find({ author: req.user._id }).populate('author', ' username').sort({ votes: -1 });
            res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
};

// Get posts liked by the authenticated user
export const getLikedPosts = async (req: Request, res: Response) => {
    try {
        console.log("Authenticated User:", req.user);

        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: No user ID found" });
        }

        const userId = new mongoose.Types.ObjectId(req.user._id);
        console.log("Searching for posts liked by:", userId);

        const posts = await Post.find({ likes: userId })
            .populate('author', 'username')
            .sort({ votes: -1 })
            .lean();

        console.log("Fetched Liked Posts:", posts);
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching liked posts:", error);
        res.status(500).json({ message: 'Error fetching liked posts', error });
    }
};

// export const getLikedPosts = async (req: Request, res: Response) => {
//     const userId = req.user._id;
//     console.log("Authenticated User ID:", userId);

//     try {
//         const posts = await Post.find({ likes: userId }).populate('author', 'username').sort({ votes: -1 });
//         res.status(200).json(posts);
//     } catch (error) {
//         console.error("Error fetching liked posts:", error);
//         res.status(500).json({ message: 'Error fetching liked posts', error });
//     }
// };

// Update a post
export const updatePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const post = await Post.findById(id);
        if (!post || (post.author.toString() !== (req.user)._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to update this post' });
        }

        post.title = title;
        post.content = content;
        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error updating post', error });
    }
};

// Delete a post
export const deletePost = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const post = await Post.findById(id);
        if (!post || (post.author.toString() !== (req.user )._id.toString())) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const deletedPost = await post.remove();
        if(deletedPost)
        res.status(200).json("Post deleted");
        else
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post' });
    }
};

// Like or Unlike a post
export const likePost = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user._id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (post.likes.includes(userId)) {
            // Unlike the post
            post.likes = post.likes.filter((like: string) => like.toString() !== userId.toString());
            post.votes -= 1;
            await post.save();

            await updateLikedPosts(userId);

            return res.status(200).json({ message: 'Post unliked successfully', post });
        } else {
            // Like the post
            post.likes.push(userId);
            post.votes += 1;
            await post.save();

            await updateLikedPosts(userId);

            return res.status(200).json({ message: 'Post liked successfully', post });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error liking/unliking post', error });
    }
};

// Create a comment
export const createComment = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const comment = {
            user: userId,
            content,
            username: user.username,
            coverImg: user.coverImg, // Add coverImg to the comment
            createdAt: new Date(),
        };

        post.comments.push(comment);
        await post.save();

        // Log the saved post to verify the comment was added correctly
        console.log('Saved post with new comment:', post);

        res.status(201).json({ message: 'Comment added successfully', post });
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ message: 'Error adding comment', error });
    }
};
// Delete a comment
export const deleteComment = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment || comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.remove();
        await post.save();

        res.status(200).json({ message: 'Comment deleted successfully', post });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error });
    }
};

// Update a comment
export const updateComment = async (req: Request, res: Response) => {
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = post.comments.id(commentId);
        if (!comment || comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this comment' });
        }

        comment.content = content;
        await post.save();

        res.status(200).json({ message: 'Comment updated successfully', post });
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ message: 'Error updating comment', error });
    }
};


