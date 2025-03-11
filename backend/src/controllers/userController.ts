import { Request, Response } from "express-serve-static-core";
import mongoose from "mongoose";
import User from "../models/userModel";
import Post from "../models/postModel";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
interface AuthenticatedRequest extends Request {
    user: {
        _id: string;
    };
    params: {
        id: string;
    };
    body: {
        username?: string;
        currentPassword?: string;
        newPassword?: string;
        bio?: string;
        link?: string;
        profileImg?: string;
        coverImg?: string;
    };
}


export const getUserProfile = async (req: Request, res: Response) : Promise<void> => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in GetUserProfile: " + error);
        res.status(500).json({ error: error });
        return;
    }
};

export const blockUnblockUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user._id);
        const blockedUser = await User.findById(id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't block yourself" });
        }

        if (!currentUser || !blockedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Ensure blockedUsers array is initialized
        if (!currentUser.blockedUsers) {
            currentUser.blockedUsers = [];
        }

        const isBlocked = currentUser.blockedUsers.some((user: { userId: mongoose.Types.ObjectId }) => user.userId && user.userId.toString() === id);

        if (isBlocked) {
            // Unblock the user
            await User.findByIdAndUpdate(req.user._id, { $pull: { blockedUsers: { userId: id } } });
            res.status(200).json({ message: "User unblocked" });
        } else {
            // Block the user
            const blockedUserInfo = {
                userId: blockedUser._id,
                blockedAt: new Date(),
                username: blockedUser.username,
                coverImg: blockedUser.coverImg,
            };
            await User.findByIdAndUpdate(req.user._id, { $push: { blockedUsers: blockedUserInfo } });
            res.status(200).json({ message: "User blocked" });
        }
    } catch (error) {
        console.error("Error: " + error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getBlockedAccounts = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).populate('blockedUsers', 'username profileImg');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.blockedUsers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching blocked accounts', error });
    }
};

export const followUnfollowUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }

        if (!userToModify || !currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const isFollowing = currentUser.following.includes(new mongoose.Types.ObjectId(id));

        if (isFollowing) {
            // Unfollow the user
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed" });
        } else {
            // Follow the user
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });


            res.status(200).json({ message: "User followed" });
        }
    } catch (error) {
        console.error("Error: " + error);
        return res.status(500).json({ message: "Server error" });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { username, currentPassword, newPassword, bio, link, profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if ((!newPassword && currentPassword) || (newPassword && !currentPassword)) {
            return res.status(400).json({ message: "Please enter The New Password and The Current Password" });
        }

        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);

            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect" });
            }

            if (newPassword.length < 8) {
                return res.status(400).json({ error: "Password must be at least 8 characters" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        if (profileImg) {
            user.profileImg = profileImg;
        }

        if (coverImg) {
            user.coverImg = coverImg;
        }

        if (username) {
            const lastNameChange = user.lastNameChange;
            const currentDate = new Date();
            const diffTime = Math.abs(currentDate.getTime() - new Date(lastNameChange).getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (lastNameChange && diffDays < 3) {
                return res.status(400).json({ message: "You cannot change your name more than once within 3 days." });
            }

            user.username = username;
            user.lastNameChange = new Date();
        }

        user.bio = bio || user.bio;
        user.link = link || user.link;
        user = await user.save();

        user.password = "";
        return res.status(200).json(user);
    } catch (error) {
        console.error("Error: " + error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Function to update likedPosts array
export const updateLikedPosts = async (userId: string) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const likedPosts = await Post.find({ likes: { $in: [userId] } }).select("_id title content author votes");
        user.likedPosts = likedPosts.map((post: { _id: mongoose.Types.ObjectId }) => post._id);
        await user.save();
    } catch (error) {
        console.error("Error updating likedPosts:", error);
    }
};





// export const getSuggestedUsers = async (req: Request, res: Response) => {
//     try {
//         const userID = req.user._id;

//         const usersFollowedByMe = await User.findById(userID).select("following");

//         const users = await User.aggregate([
//             {
//                 $match: {
//                     _id: { $ne: userID },
//                 },
//             },
//             { $sample: { size: 10 } },
//         ]);

//         if (!usersFollowedByMe) {
//             return res.status(404).json({ error: "User not found" });
//         }
//         const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
//         const SuggestedUsers = filteredUsers.slice(0, 4);
//         SuggestedUsers.forEach((user) => (user.password = null));
//         res.status(200).json(SuggestedUsers);
//     } catch (error) {
//         res.status(500).json({ error: error });
//     }
// };