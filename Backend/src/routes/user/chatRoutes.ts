// import { Request, Response, Router } from 'express';
// import Conversation from '../../models/user/conversationModel';
// import Message from '../../models/user/messageModel';
// import Contract from '../../models/client/contractModel';

// const router = Router();

// router.get('/messages/:userId', async (req: Request, res: Response): Promise<void> => {
//     const { userId } = req.params;

//     try {
//         const conversations = await Conversation.find({
//             $or: [{ clientId: userId }, { freelancerId: userId }]
//         }).sort({ updatedAt: -1 });

//         const conversationsWithDetails = await Promise.all(
//             conversations.map(async (conv) => {
//                 const unreadCount = await Message.countDocuments({
//                     conversationId: conv._id,
//                     receiverId: userId,
//                     isRead: false
//                 });

//                 const otherUserId = conv.clientId.toString() === userId
//                     ? conv.freelancerId
//                     : conv.clientId;

//                 return {
//                     ...conv.toObject(),
//                     unreadCount,
//                     otherUserId
//                 };
//             })
//         );

//         res.json(conversationsWithDetails);
//     } catch (error) {
//         console.error('Error fetching conversations:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post('/message/send', async (req: Request, res: Response): Promise<void> => {
//     const { conversationId, senderId, receiverId, message } = req.body;

//     try {
//         if (!conversationId || !senderId || !receiverId || !message) {
//             res.status(400).json({ message: 'Missing required fields' });
//             return;
//         }

//         const newMessage = new Message({
//             conversationId,
//             senderId,
//             receiverId,
//             message,
//             isRead: false,
//             sentAt: new Date()
//         });

//         await newMessage.save();

//         // Optionally update conversation with last message
//         await Conversation.findByIdAndUpdate(conversationId, {
//             lastMessage: message,
//             updatedAt: new Date()
//         });

//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.error('Error sending message:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// router.post('/:clientId/:freelancerId/initialize', async (req: Request, res: Response): Promise<void> => {
//     const { clientId, freelancerId } = req.params;

//     try {
//         const contract = await Contract.findOne({
//             clientId,
//             freelancerId,
//             isDeleted: false,
//             $or: [
//                 { status: 'Pending' },
//                 { status: 'Started' },
//                 { status: 'Ongoing' }
//             ]
//         });

//         if (!contract) {
//             res.status(403).json({ message: 'No active contract exists between these users' });
//             return;
//         }

//         let conversation = await Conversation.findOne({ clientId, freelancerId });

//         if (!conversation) {
//             conversation = new Conversation({
//                 clientId,
//                 freelancerId,
//                 lastMessage: ''
//             });
//             await conversation.save();
//         }

//         const messages = await Message.find({ conversationId: conversation._id })
//             .sort({ createdAt: 1 })
//             .limit(50);

//         res.json({
//             conversationId: conversation._id,
//             messages
//         });
//     } catch (error) {
//         console.error('Error initializing chat:', error);
//         res.status(500).json({ message: 'Failed to initialize chat' });
//     }
// });

// router.put('/read/:messageId/:userId', async (req: Request, res: Response): Promise<void> => {
//     const { messageId, userId } = req.params;

//     try {
//         const message = await Message.findById(messageId);

//         if (message && message.receiverId.toString() === userId) {
//             message.isRead = true;
//             message.readAt = new Date();
//             await message.save();
//             res.json({ success: true, messageId, readAt: message.readAt });
//         } else {
//             res.status(403).json({ message: 'Not authorized to mark this message as read' });
//         }
//     } catch (error) {
//         console.error('Error marking message as read:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// });

// export default router;