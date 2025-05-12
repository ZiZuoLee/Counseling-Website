import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const signup = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, password, userType, specialization, level } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate userType
    if (!['user', 'counselor', 'admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Validate specialization for counselors
    if (userType === 'counselor' && !specialization) {
      return res.status(400).json({ message: 'Specialization is required for counselors' });
    }

    // Validate level for counselors
    if (userType === 'counselor' && !level) {
      return res.status(400).json({ message: 'Level is required for counselors' });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role: userType,
      specialization: userType === 'counselor' ? specialization : undefined,
      level: userType === 'counselor' ? level : undefined,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        level: user.level,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    return res.status(500).json({ 
      message: error.message || 'Error creating user',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password, userType } = req.body;

    // Validate required fields
    if (!email || !password || !userType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate userType
    if (!['user', 'counselor', 'admin'].includes(userType)) {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check user type
    if (user.role !== userType) {
      return res.status(401).json({ message: 'Invalid user type' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization,
        level: user.level,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      message: error.message || 'Error logging in',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching profile' });
  }
}; 