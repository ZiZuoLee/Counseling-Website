import express from 'express';
import { auth, checkRole } from '../middleware/auth';
import {
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment,
} from '../controllers/appointment';

const router = express.Router();

// Create new appointment
router.post('/', auth, createAppointment);

// Get appointments (filtered by user role)
router.get('/', auth, getAppointments);

// Update appointment status (counselor only)
router.patch('/:appointmentId/status', auth, checkRole(['counselor']), updateAppointmentStatus);

// Delete appointment
router.delete('/:appointmentId', auth, deleteAppointment);

export default router; 