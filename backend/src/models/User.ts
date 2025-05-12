import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'counselor' | 'admin';
  specialization?: string;
  level?: 'intern' | 'professional' | 'expert' | 'institution';
  rating?: number;
  ratingCount?: number;
  status?: 'available' | 'busy' | 'offline';
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'counselor', 'admin'],
      default: 'user',
    },
    specialization: {
      type: String,
      required: function() {
        return this.role === 'counselor';
      },
    },
    level: {
      type: String,
      enum: ['intern', 'professional', 'expert', 'institution'],
      required: function() {
        return this.role === 'counselor';
      },
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'offline',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema); 