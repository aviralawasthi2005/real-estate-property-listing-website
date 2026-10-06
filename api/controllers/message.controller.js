import mongoose from 'mongoose';
import Conversation from '../models/conversation.model.js';
import Message from '../models/message.model.js';
import { getReceiverSocketId, io } from '../socket/socket.js';
import { errorHandler } from '../utils/error.js';

export const sendMessage = async (req, res, next) => {
  try {
    const { recipientId, message } = req.body;
    const senderId = req.user.id;

    if (!recipientId || !mongoose.Types.ObjectId.isValid(recipientId)) {
      return next(errorHandler(400, 'Invalid or missing recipient ID.'));
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return next(errorHandler(400, 'Message cannot be empty.'));
    }

    const trimmedText = message.trim().slice(0, 2000);

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, recipientId],
        lastMessage: {
          text: trimmedText,
          sender: senderId,
        },
      });
      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: trimmedText,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: trimmedText,
          sender: senderId,
        },
      }),
    ]);

    const recipientSocketId = getReceiverSocketId(recipientId);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  const { otherUserId } = req.params;
  const userId = req.user.id;
  try {
    if (!otherUserId || otherUserId === 'undefined' || !mongoose.Types.ObjectId.isValid(otherUserId)) {
      return next(errorHandler(400, 'Invalid or missing user ID.'));
    }

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, otherUserId] },
    });

    if (!conversation) return res.status(200).json([]);

    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: 1 })
      .limit(100)
      .lean();

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const conversations = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate({
        path: 'participants',
        select: 'username avatar',
      })
      .lean();

    // Filter out current user from participants list and format for frontend
    const formattedConversations = conversations
      .map((conversation) => {
        conversation.participants = (conversation.participants || []).filter(
          (participant) => participant._id.toString() !== userId.toString()
        );
        return conversation;
      })
      .filter((conv) => conv.participants.length > 0);

    res.status(200).json(formattedConversations);
  } catch (error) {
    next(error);
  }
};
