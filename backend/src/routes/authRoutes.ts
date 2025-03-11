import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController';
import checkLoggedIn from '../middleware/checkLoggedIn';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Route for user registration
router.post('/register', register);

// Route for user login
router.post('/login', checkLoggedIn, login);
   


// Route for user logout
router.post('/logout', logout);
router.get('/me', authMiddleware ,getMe);

export default router;