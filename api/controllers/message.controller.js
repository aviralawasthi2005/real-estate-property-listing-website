import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res, next) => {
    try {
        const { recipientId, message } = req.body;
        const senderId = req.user.id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, recipientId] },
        });

        if (!conversation) {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });
            await conversation.save();
        }

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message,
        });

        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            }),
        ]);

        const recipientSocketId = getReceiverSocketId(recipientId);
        if (recipientSocketId) {
            io.to(recipientSocketId).emit("newMessage", newMessage);
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
        if (!otherUserId || otherUserId === 'undefined') {
            return res.status(200).json([]);
        }
        const conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
        });

        if (!conversation) return res.status(200).json([]);

        const messages = await Message.find({
            conversationId: conversation._id,
        }).sort({ createdAt: 1 });

        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
};

export const getConversations = async (req, res, next) => {
    const userId = req.user.id;
    try {
        const conversations = await Conversation.find({ participants: userId }).populate({
            path: "participants",
            select: "username avatar",
        });

        // remove the current user from the participants list and convert to plain objects
        const formattedConversations = conversations
            .map((conversation) => {
                const conversationObject = conversation.toObject();
                conversationObject.participants = conversationObject.participants.filter(
                    (participant) => participant._id.toString() !== userId.toString()
                );
                return conversationObject;
            })
            .filter((conv) => conv.participants.length > 0); // Only return conversations with others

        res.status(200).json(formattedConversations);
    } catch (error) {
        next(error);
    }
};
