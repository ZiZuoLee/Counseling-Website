import { Request, Response } from 'express';
import Hotline from '../models/Hotline';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const startHotline = async (req: AuthRequest, res: Response) => {
  try {
    const { counselorId, emergencyDetails } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    // Check if counselor exists and is available
    const counselor = await User.findOne({
      _id: counselorId,
      role: 'counselor',
      status: 'available',
    });

    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not available' });
    }

    // Create hotline session
    const hotline = new Hotline({
      user: userId,
      counselor: counselorId,
      emergencyDetails,
      status: 'active',
    });

    await hotline.save();

    // Update counselor status
    counselor.status = 'busy';
    await counselor.save();

    return res.status(201).json(hotline);
  } catch (error) {
    return res.status(500).json({ message: 'Error starting hotline' });
  }
};

export const endHotline = async (req: AuthRequest, res: Response) => {
  try {
    const { hotlineId } = req.params;
    const { notes } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    const hotline = await Hotline.findById(hotlineId);
    if (!hotline) {
      return res.status(404).json({ message: 'Hotline session not found' });
    }

    // Check if user is either the counselor or the user who started the hotline
    if (
      hotline.counselor.toString() !== userId.toString() &&
      hotline.user.toString() !== userId.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    hotline.status = 'completed';
    hotline.endTime = new Date();
    if (notes) {
      hotline.notes = notes;
    }

    await hotline.save();

    // Update counselor status back to available
    const counselor = await User.findById(hotline.counselor);
    if (counselor) {
      counselor.status = 'available';
      await counselor.save();
    }

    return res.json(hotline);
  } catch (error) {
    return res.status(500).json({ message: 'Error ending hotline' });
  }
};

export const getActiveHotlines = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    let hotlines;
    if (role === 'counselor') {
      hotlines = await Hotline.find({
        counselor: userId,
        status: 'active',
      }).populate('user', 'name email');
    } else {
      hotlines = await Hotline.find({
        user: userId,
        status: 'active',
      }).populate('counselor', 'name email specialization');
    }

    return res.json(hotlines);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching hotlines' });
  }
};

export const getHotlineHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    let hotlines;
    if (role === 'counselor') {
      hotlines = await Hotline.find({
        counselor: userId,
        status: { $in: ['completed', 'missed'] },
      })
        .populate('user', 'name email')
        .sort({ startTime: -1 });
    } else {
      hotlines = await Hotline.find({
        user: userId,
        status: { $in: ['completed', 'missed'] },
      })
        .populate('counselor', 'name email specialization')
        .sort({ startTime: -1 });
    }

    return res.json(hotlines);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching hotline history' });
  }
}; 