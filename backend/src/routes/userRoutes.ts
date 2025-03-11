import express from 'express';
import { followUnfollowUser , getUserProfile , updateUser,blockUnblockUser, getBlockedAccounts } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();


router.post('/follow/:id' ,authMiddleware, followUnfollowUser);
router.post('/update' ,authMiddleware, updateUser);
router.get('/profile/:username' ,authMiddleware, getUserProfile);
router.post('/block/:id' ,authMiddleware, blockUnblockUser);
router.get('/blocked' ,authMiddleware, getBlockedAccounts);

export default router;