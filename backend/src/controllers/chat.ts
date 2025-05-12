import { Request, Response } from 'express';
import Chat from '../models/Chat';
import User, { IUser } from '../models/User';

interface AuthRequest extends Request {
  user?: IUser;
}

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const { participantId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    // Check if participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({ message: 'Participant not found' });
    }

    // Check if chat already exists
    const existingChat = await Chat.findOne({
      participants: { $all: [userId, participantId] },
    });

    if (existingChat) {
      return res.json(existingChat);
    }

    // Create new chat
    const chat = new Chat({
      participants: [userId, participantId],
      messages: [],
    });

    await chat.save();

    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating chat' });
  }
};

export const getChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email role')
      .sort({ updatedAt: -1 });

    return res.json(chats);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching chats' });
  }
};

export const getChatMessages = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name email role')
      .populate('messages.sender', 'name email role');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.some((p: any) => p._id.toString() === userId.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    return res.json(chat.messages);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Please authenticate' });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is a participant
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const message = {
      sender: userId,
      content,
      timestamp: new Date(),
    };

    chat.messages.push(message as any);
    chat.lastMessage = message as any;
    await chat.save();

    return res.status(201).json(message);
  } catch (error) {
    return res.status(500).json({ message: 'Error sending message' });
  }
}; 