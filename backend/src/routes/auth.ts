import express from 'express';
import { signup, login, getProfile } from '../controllers/auth';
import { auth } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, getProfile);

export default router; 