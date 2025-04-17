import { Server as HTTPServer } from 'http';
import { Server } from 'socket.io';
import Contract from '../models/client/contractModel';
import Conversation from '../models/user/conversationModel';
import Message from '../models/user/messageModel';
import { env } from '../config/env.config';
import Notification from '../models/user/notificationModel';

const activeUsers = new Map<string, string>();

let io: Server;

export const initSocket = (server: HTTPServer) => {
    io = new Server(server, {
        cors: {
            origin: env.CLIENT_URL,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('authenticate', async (userId: string) => {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} authenticated with socket ${socket.id}`);
            socket.broadcast.emit('userStatus', { userId, status: 'online' });
        });

        socket.on('initializeChat', async ({ clientId, freelancerId }) => {
            // console.log('Recieved client id in initializeChat', clientId);
            // console.log('Recieved freelancer id in initializeChat', clientId);
            try {
                const contract = await Contract.findOne({
                    clientId,
                    freelancerId,
                    isDeleted: false,
                });

                // console.log(`Contract found between ${freelancerId} and ${clientId} = ${contract}`)

                if (!contract) {
                    socket.emit('chatError', { message: 'No active contract exists between these users' });
                    return;
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

                socket.emit('chatInitialized', {
                    conversationId: conversation._id,
                    messages
                });
            } catch (error) {
                console.error('Error initializing chat:', error);
                socket.emit('chatError', { message: 'Failed to initialize chat' });
            }
        });

        socket.on('sendMessage', async ({ conversationId, senderId, receiverId, message }) => {
            try {
                const conversation = await Conversation.findById(conversationId);
                if (!conversation) {
                    socket.emit('messageError', { message: 'Conversation not found' });
                    return;
                }

                if (
                    conversation.clientId.toString() !== senderId &&
                    conversation.freelancerId.toString() !== senderId
                ) {
                    socket.emit('messageError', { message: 'Unauthorized to send message in this conversation' });
                    return;
                }

                const newMessage = new Message({
                    conversationId,
                    senderId,
                    receiverId,
                    message,
                    isRead: false
                });
                await newMessage.save();

                conversation.lastMessage = message;
                conversation.lastMessageAt = new Date();
                await conversation.save();

                socket.emit('messageSent', newMessage);

                const receiverSocketId = activeUsers.get(receiverId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', newMessage);
                }
            } catch (error) {
                console.error('Error sending message:', error);
                socket.emit('messageError', { message: 'Failed to send message' });
            }
        });

        socket.on('markAsRead', async ({ messageId, userId }) => {
            try {
                const message = await Message.findById(messageId);
                if (message && message.receiverId.toString() === userId) {
                    message.isRead = true;
                    message.readAt = new Date();
                    await message.save();

                    const senderSocketId = activeUsers.get(message.senderId.toString());
                    if (senderSocketId) {
                        io.to(senderSocketId).emit('messageRead', { messageId, readAt: message.readAt });
                    }
                }
            } catch (error) {
                console.error('Error marking message as read:', error);
            }
        });

        socket.on('getConversations', async (userId: string) => {
            try {
                const conversations = await Conversation.find({
                    $or: [
                        { clientId: userId },
                        { freelancerId: userId }
                    ]
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

                socket.emit('conversations', conversationsWithDetails);
            } catch (error) {
                console.error('Error fetching conversations:', error);
                socket.emit('conversationError', { message: 'Failed to fetch conversations' });
            }
        });

        socket.on('getUnreadCount', async (userId: string) => {
            try {
                const conversations = await Conversation.find({
                    $or: [
                        { clientId: userId },
                        { freelancerId: userId }
                    ]
                });
        
                const unreadCounts = await Promise.all(
                    conversations.map(async (conv) => {
                        const count = await Message.countDocuments({
                            conversationId: conv._id,
                            receiverId: userId,
                            isRead: false
                        });
                        return {
                            conversationId: conv._id,
                            otherUserId: conv.clientId.toString() === userId ? 
                                conv.freelancerId.toString() : 
                                conv.clientId.toString(),
                            count
                        };
                    })
                );
        
                socket.emit('unreadCounts', unreadCounts);
            } catch (error) {
                console.error('Error getting unread counts:', error);
                socket.emit('unreadCountError', { message: 'Failed to get unread counts' });
            }
        });

        socket.on('deleteMessage', async ({ messageId, userId }) => {
            try {
                const message = await Message.findById(messageId);
                if (!message) {
                    return socket.emit('messageError', { message: 'Message not found' });
                }
        
                const conversation = await Conversation.findById(message.conversationId);
                if (!conversation) {
                    return socket.emit('messageError', { message: 'Conversation not found' });
                }
        
                if (message.senderId.toString() !== userId) {
                    return socket.emit('messageError', { message: 'Unauthorized to delete this message' });
                }
        
                message.message = 'This message was deleted';
                await message.save();
        
                conversation.lastMessage = 'You deleted this message';
                await conversation.save();
        
                const receiverSocketId = activeUsers.get(message.receiverId.toString());
                const senderSocketId = activeUsers.get(message.senderId.toString());
        
                const payload = {
                    messageId: message._id,
                    message: message.message,
                };
        
                if (senderSocketId) {
                    io.to(senderSocketId).emit('messageDeleted', payload);
                }
        
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('messageDeleted', payload);
                }
            } catch (error) {
                console.error('Error deleting message:', error);
                socket.emit('messageError', { message: 'Failed to delete message' });
            }
        });            
        
        // Notifications
        socket.on('getNotifications', async (userId: string) => {
            try {
                const notifications = await Notification.find({ userId })
                    .sort({ createdAt: -1 })
                    .limit(5);
                socket.emit('notifications', notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
                socket.emit('notificationError', { message: 'Failed to fetch notifications' });
            }
        });      
        
        socket.on('addNotification', async ({ userId, message, role, type }) => {
            try {
                const newNotification = new Notification({
                    userId,
                    message,
                    role,
                    type,
                    read: false,
                });
                await newNotification.save();
        
                const receiverSocketId = activeUsers.get(userId);
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newNotification', newNotification);
                }
            } catch (error) {
                console.error('Error adding notification:', error);
                socket.emit('notificationError', { message: 'Failed to add notification' });
            }
        });

        socket.on('markNotificationAsRead', async (notificationId: string) => {
            try {
                const notification = await Notification.findById(notificationId);
                if (!notification) {
                    return socket.emit('notificationError', { message: 'Notification not found' });
                }
        
                notification.read = true;
                await notification.save();
        
                socket.emit('notificationRead', { notificationId });
            } catch (error) {
                console.error('Error marking notification as read:', error);
                socket.emit('notificationError', { message: 'Failed to mark notification as read' });
            }
        });
        
        socket.on('disconnect', () => {
            for (const [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    activeUsers.delete(userId);
                    socket.broadcast.emit('userStatus', { userId, status: 'offline' });
                    break;
                }
            }
            console.log('User disconnected:', socket.id);
        });

    });
};

export { io };