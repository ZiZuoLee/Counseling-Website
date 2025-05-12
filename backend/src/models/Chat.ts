import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  messages: IMessage[];
  lastMessage?: IMessage;
  isActive: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }
);

const chatSchema = new Schema<IChat>(
  {
    participants: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }],
    messages: [messageSchema],
    lastMessage: messageSchema,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
chatSchema.index({ participants: 1 });
chatSchema.index({ 'lastMessage.timestamp': -1 });

export default mongoose.model<IChat>('Chat', chatSchema); 