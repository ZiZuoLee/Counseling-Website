import express from 'express';
import { auth } from '../middleware/auth';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointment';

const router = express.Router();

// All routes are protected
router.use(auth);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.patch('/:appointmentId/status', updateAppointmentStatus);
router.delete('/:appointmentId', deleteAppointment);

export default router; 