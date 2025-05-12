import { Request, Response } from 'express';
import User from '../models/User';

interface AuthRequest extends Request {
  user?: {
    _id: string;
    role: string;
  };
}

// Get all users (admin and counselor access)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const role = req.user?.role;
    
    // If admin, return all users
    // If counselor, return only regular users
    const query = role === 'admin' ? {} : { role: 'user' };
    
    const users = await User.find(query)
      .select('-password')
      .sort({ name: 1 });
      
    return res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
};

// Get all counselors
export const getCounselors = async (_req: Request, res: Response) => {
  try {
    const counselors = await User.find({ role: 'counselor' })
      .select('-password')
      .sort({ name: 1 });
    return res.json(counselors);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    return res.status(500).json({ message: 'Error fetching counselors' });
  }
};

// Update user status
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error updating user status:', error);
    return res.status(500).json({ message: 'Error updating user status' });
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.role;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user);
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'Error updating profile' });
  }
};

// Rate a counselor
export const rateCounselor = async (req: Request, res: Response) => {
  try {
    const { counselorId } = req.params;
    const { rating } = req.body;

    const counselor = await User.findById(counselorId);
    if (!counselor) {
      return res.status(404).json({ message: 'Counselor not found' });
    }

    if (counselor.role !== 'counselor') {
      return res.status(400).json({ message: 'User is not a counselor' });
    }

    // Update counselor's rating
    const newRating = ((counselor.rating || 0) + rating) / 2;
    counselor.rating = newRating;
    await counselor.save();

    return res.json({ message: 'Rating updated successfully', rating: newRating });
  } catch (error) {
    console.error('Error rating counselor:', error);
    return res.status(500).json({ message: 'Error rating counselor' });
  }
}; 