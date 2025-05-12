import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import {
  getUsers,
  getCounselors,
  updateUserStatus,
  updateUserProfile,
  deleteUser,
  updateCounselorRating,
} from '../controllers/users';

const router = express.Router();

// Get all users (admin only)
router.get('/', auth, checkRole(['admin']), getUsers);

// Get all counselors
router.get('/counselors', getCounselors);

// Update user status
router.patch('/:userId/status', auth, updateUserStatus);

// Update user profile
router.patch('/:userId/profile', auth, updateUserProfile);

// Delete user (admin only)
router.delete('/:userId', auth, checkRole(['admin']), deleteUser);

// Update counselor rating
router.post('/counselors/:counselorId/rate', auth, updateCounselorRating);

export default router; 