import express from 'express';
import { auth } from '../middleware/auth';
import {
  startHotline,
  endHotline,
  getActiveHotlines,
  getHotlineHistory,
} from '../controllers/hotline';

const router = express.Router();

// All routes are protected
router.use(auth);

// Start a new hotline session
router.post('/', startHotline);

// End a hotline session
router.put('/:hotlineId/end', endHotline);

// Get active hotline sessions
router.get('/active', getActiveHotlines);

// Get hotline history
router.get('/history', getHotlineHistory);

export default router; 