import { Request, Response } from 'express';
import Appointment from '../models/Appointment';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { counselorId, date, reason, type } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    // Check if counselor exists
    const counselor = await User.findOne({ _id: counselorId, role: 'counselor' });
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    // Create appointment
    const appointment = new Appointment({
      user: userId,
      counselor: counselorId,
      date: new Date(date),
      reason,
      type: type || 'online', // Default to online if not specified
    });

    await appointment.save();

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating appointment' });
  }
};

export const getAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    let appointments;
    if (role === 'counselor') {
      appointments = await Appointment.find({ counselor: userId })
        .populate('user', 'name email')
        .sort({ date: 1 });
    } else {
      appointments = await Appointment.find({ user: userId })
        .populate('counselor', 'name email specialization')
        .sort({ date: 1 });
    }

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching appointments' });
  }
};

export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is the counselor for this appointment
    if (appointment.counselor.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = status;
    if (notes) {
      appointment.notes = notes;
    }

    await appointment.save();

    return res.json(appointment);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating appointment' });
  }
};

export const deleteAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { appointmentId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user is either the counselor or the user who booked the appointment
    if (
      appointment.counselor.toString() !== userId.toString() &&
      appointment.user.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Appointment.deleteOne({ _id: appointmentId });

    return res.json({ message: 'Appointment deleted' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting appointment' });
  }
}; 