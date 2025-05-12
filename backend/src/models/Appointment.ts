import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointment extends Document {
  user: mongoose.Types.ObjectId;
  counselor: mongoose.Types.ObjectId;
  date: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'online' | 'offline';
  notes?: string;
}

const appointmentSchema = new Schema<IAppointment>(
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
    date: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    type: {
      type: String,
      enum: ['online', 'offline'],
      default: 'online',
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
appointmentSchema.index({ user: 1, date: 1 });
appointmentSchema.index({ counselor: 1, date: 1 });

export default mongoose.model<IAppointment>('Appointment', appointmentSchema); 