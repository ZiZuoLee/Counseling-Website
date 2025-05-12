import mongoose, { Document, Schema } from 'mongoose';

export interface IHotline extends Document {
  user: mongoose.Types.ObjectId;
  counselor: mongoose.Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'completed' | 'missed';
  emergencyDetails: string;
  notes?: string;
}

const hotlineSchema = new Schema<IHotline>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    counselor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'missed'],
      default: 'active',
    },
    emergencyDetails: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
hotlineSchema.index({ user: 1, startTime: -1 });
hotlineSchema.index({ counselor: 1, startTime: -1 });
hotlineSchema.index({ status: 1 });

export default mongoose.model<IHotline>('Hotline', hotlineSchema); 