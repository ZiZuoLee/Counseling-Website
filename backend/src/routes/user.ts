import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import {
  getUsers,
  getCounselors,
  updateStatus,
  updateProfile,
  rateCounselor,
} from '../controllers/user';

const router = express.Router();

// Protected routes
router.get('/', auth, checkRole(['admin', 'counselor']), getUsers);
router.get('/counselors', auth, getCounselors);
router.patch('/:userId/status', auth, updateStatus);
router.patch('/:userId/profile', auth, updateProfile);
router.post('/counselors/:counselorId/rate', auth, rateCounselor);

export default router; 