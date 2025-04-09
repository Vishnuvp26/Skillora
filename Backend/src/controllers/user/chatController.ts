import { Request, Response } from 'express';
import Conversation from '../../models/user/conversationModel';
import Message from '../../models/user/messageModel';
import Contract from '../../models/client/contractModel';

// Get all conversations for a user
export const getConversations = async (req: Request, res: Response) => {
    const { userId } = req.params;

    try {
        const conversations = await Conversation.find({
            $or: [{ clientId: userId }, { freelancerId: userId }]
        }).sort({ updatedAt: -1 });

        const conversationsWithDetails = await Promise.all(
            conversations.map(async (conv) => {
                const unreadCount = await Message.countDocuments({
                    conversationId: conv._id,
                    receiverId: userId,
                    isRead: false
                });

                const otherUserId = conv.clientId.toString() === userId
                    ? conv.freelancerId
                    : conv.clientId;

                return {
                    ...conv.toObject(),
                    unreadCount,
                    otherUserId
                };
            })
        );

        res.json(conversationsWithDetails);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Initialize a chat (creates conversation if contract exists)
export const initializeChat = async (req: Request, res: Response) => {
    const { clientId, freelancerId } = req.params;

    try {
        const contract = await Contract.findOne({
            clientId,
            freelancerId,
            isDeleted: false,
            $or: [
                { status: 'Pending' },
                { status: 'Started' },
                { status: 'Ongoing' }
            ]
        });

        if (!contract) {
            return res.status(403).json({ message: 'No active contract exists between these users' });
        }

        let conversation = await Conversation.findOne({ clientId, freelancerId });

        if (!conversation) {
            conversation = new Conversation({
                clientId,
                freelancerId,
                lastMessage: ''
            });
            await conversation.save();
        }

        const messages = await Message.find({ conversationId: conversation._id })
            .sort({ createdAt: 1 })
            .limit(50);

        res.json({
            conversationId: conversation._id,
            messages
        });
    } catch (error) {
        console.error('Error initializing chat:', error);
        res.status(500).json({ message: 'Failed to initialize chat' });
    }
};

// Mark a message as read
export const markMessageAsRead = async (req: Request, res: Response) => {
    const { messageId, userId } = req.params;

    try {
        const message = await Message.findById(messageId);

        if (message && message.receiverId.toString() === userId) {
            message.isRead = true;
            message.readAt = new Date();
            await message.save();
            return res.json({ success: true, messageId, readAt: message.readAt });
        }

        res.status(403).json({ message: 'Not authorized to mark this message as read' });
    } catch (error) {
        console.error('Error marking message as read:', error);
        res.status(500).json({ message: 'Server error' });
    }
};