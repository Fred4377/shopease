import express from 'express';
const router = express.Router();
import {
  registerUser,
  authUser,
  getUserProfile,
  googleLogin,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);
router.get('/profile', protect, getUserProfile);

export default router;
