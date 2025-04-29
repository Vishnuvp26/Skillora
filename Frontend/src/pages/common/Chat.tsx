import { getClientContracts } from "@/api/client/contractApi";
import { getContracts } from "@/api/freelancer/contractApi";
import { RootState } from "@/redux/store/store";
import { socket } from "@/utils/socket";
import { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { ContractType, ConversationType, MessageType } from "@/types/Types";
import UserListSkeleton from "@/components/ui/ListSkeleton";
import { ThemeContext } from "@/context/ThemeContext";
import chatWhite from '../../assets/chatwhite.png'
import chatDark from '../../assets/chardark.png'
import { Search, SendHorizontal, Smile, Trash2, Image, FileVideo, Paperclip } from 'lucide-react';
import Picker from '@emoji-mart/react'
import { IoCheckmarkDone } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineStop } from "react-icons/ai";
import { TbMessageOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { uploadChatMedia } from "@/api/media/mediaApi";
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover";
import toast from "react-hot-toast";
import { Loader2 } from 'lucide-react';
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent,
    AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
    AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog";

const Chat = () => {
    
    const themeContext = useContext(ThemeContext);
    if (!themeContext) return null;
    const { theme } = themeContext;

    const userId = useSelector((state: RootState) => state.user._id);
    const role = useSelector((state: RootState) => state.user.role);

    const [messages, setMessages] = useState<MessageType[]>([]);
    const [conversations, setConversations] = useState<ConversationType[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [receiverId, setReceiverId] = useState<string>("");
    const [freelancers, setFreelancers] = useState<{ _id: string; name: string }[]>([]);
    const [clients, setClients] = useState<{ _id: string; name: string }[]>([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [newMessage, setNewMessage] = useState<string>("");
    const [showMobileChat, setShowMobileChat] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [unreadCounts, setUnreadCounts] = useState<{ [key: string]: number }>({});

    const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
    const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const emojiRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Authenticate socket
    useEffect(() => {
        if (!userId || !socket.connected) return;

        socket.emit("authenticate", userId);
        socket.emit('getUnreadCount', userId);
        console.log("✅ Socket authenticated:", userId);

        socket.on("userStatus", ({ userId, status }) => {
            console.log(`User ${userId} is now ${status}`);
        });

        return () => {
            socket.off("userStatus");
        };
    }, [userId]);

    // Fetch conversations
    useEffect(() => {
        if (!userId) return;

        socket.emit("getConversations", userId);
        console.log(conversations);

        socket.on("conversations", (conversationsWithDetails: ConversationType[]) => {
            console.log("✅ Conversations fetched:", conversationsWithDetails);
            setConversations(conversationsWithDetails);
        });

        socket.on("conversationError", ({ message }) => {
            console.error("❌ Conversation error:", message);
            setError(message);
        });

        return () => {
            socket.off("conversations");
            socket.off("conversationError");
        };
    }, [userId]);

    const getLastMessage = (userId: string) => {
        const convo = conversations.find(c => c.otherUserId === userId);
        return {
            message: convo?.lastMessage || "No messages yet",
            time: convo?.updatedAt
                ? new Date(convo.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ""
        };
    };
    // Initialize chat
    useEffect(() => {
        const initChat = async () => {
            try {
                if (!userId || !role) return;

                let contracts: ContractType[] = [];

                if (role === "client") {
                    const res = await getClientContracts(userId);
                    contracts = res.data || [];
                    console.log("contract clients fetched = ", contracts);
                } else if (role === "freelancer") {
                    const res = await getContracts(userId);
                    contracts = res.contracts || [];
                    console.log("freelancer contracts fetched = ", contracts);
                }

                const activeContracts = contracts.filter(
                    (contract) =>
                        !contract.isDeleted &&
                        ["Pending", "Started", "Ongoing", "Completed"].includes(contract.status)
                );

                if (activeContracts.length === 0) {
                    setError("No active contracts found, Create a contract to begin the chat");
                    setLoading(false);
                    return;
                }

                function getUniqueUsers(users: { _id: string; name: string }[]) {
                    const uniqueMap = new Map<string, { _id: string; name: string }>();
                    users.forEach((user) => {
                        if (!uniqueMap.has(user._id)) {
                            uniqueMap.set(user._id, user);
                        }
                    });
                    return Array.from(uniqueMap.values());
                }

                if (role === "client") {
                    const freelancersList = getUniqueUsers(
                        contracts.map((contract) => {
                            const freelancer = typeof contract.freelancerId === "string" ? null : contract.freelancerId;
                            return {
                                _id: freelancer?._id || "",
                                name: freelancer?.name || "Unknown",
                            };
                        })
                    );
                    setFreelancers(freelancersList);
                } else if (role === "freelancer") {
                    const clientsList = getUniqueUsers(
                        contracts.map((contract) => {
                            const client = typeof contract.clientId === "string" ? null : contract.clientId;
                            return {
                                _id: client?._id || "",
                                name: client?.name || "Unknown",
                            };
                        })
                    );
                    setClients(clientsList);
                }

                setLoading(false);
            } catch (err) {
                console.error("❌ Failed to init chat:", err);
                setError("Failed to initialize chat.");
                setLoading(false);
            }

            return () => {
                socket.off("chatInitialized");
                socket.off("chatError");
            };
        };
        initChat();
    }, [userId, role]);

    useEffect(() => {
        socket.on("chatInitialized", ({ conversationId, messages }) => {
            console.log("✅ Chat initialized:", conversationId);
            setConversationId(conversationId);
            setMessages(messages);
            if (receiverId) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [receiverId]: 0
                }));
            }
        });

        socket.on("chatError", ({ message }) => {
            console.error("❌ Chat error:", message);
            setError(message);
        });

        return () => {
            socket.off("chatInitialized");
            socket.off("chatError");
        };
    }, [receiverId]);

    const handleUserSelect = (otherUserId: string) => {
        const clientId = role === "client" ? userId : otherUserId;
        const freelancerId = role === "freelancer" ? userId : otherUserId;

        setReceiverId(otherUserId);
        setShowMobileChat(true);

        socket.emit("initializeChat", { clientId, freelancerId });
    };

    // Real-time message handling
    useEffect(() => {
        socket.on("messageSent", (savedMessage: MessageType) => {
            setMessages((prev) => [...prev, savedMessage]);
            setConversations((prevConversations) => {
                return prevConversations.map((conversation) => {
                    if (conversation._id === savedMessage.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: savedMessage.message,
                            lastMessageAt: savedMessage.createdAt,
                        };
                    }
                    return conversation;
                });
            });
            socket.emit("getConversations", userId);
        });

        socket.on("newMessage", (incomingMessage: MessageType) => {
            setMessages((prev) => [...prev, incomingMessage]);
            
            setConversations((prevConversations) => {
                const updatedConversations = prevConversations.map((conversation) => {
                    if (conversation._id === incomingMessage.conversationId) {
                        return {
                            ...conversation,
                            lastMessage: incomingMessage.message,
                            updatedAt: incomingMessage.createdAt,
                        };
                    }
                    return conversation;
                });
                
                return [...updatedConversations].sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
            });
        
            if (incomingMessage.senderId !== userId) {
                setUnreadCounts(prev => ({
                    ...prev,
                    [incomingMessage.senderId]: (prev[incomingMessage.senderId] || 0) + 1
                }));
            }
        });

        socket.on("chatInitialized", () => {
            socket.emit('getUnreadCount', userId);
        });
    
        socket.on('unreadCounts', (counts: Array<{ otherUserId: string, count: number }>) => {
            const countsMap = counts.reduce((acc, curr) => ({
                ...acc,
                [curr.otherUserId]: curr.count
            }), {});
            setUnreadCounts(countsMap);
        });

        socket.on("messageError", ({ message }) => {
            console.error("❌ Message error:", message);
        });

        socket.on("messageRead", ({ messageId, readAt }) => {
            setMessages(prev => prev.map(msg =>
                msg._id === messageId
                    ? { ...msg, isRead: true, readAt: new Date(readAt) }
                    : msg
            ));
        });

        return () => {
            socket.off("messageSent");
            socket.off("newMessage");
            socket.off("messageError");
            socket.off("messageRead");
        };
    }, []);

    // Mark messages as read
    useEffect(() => {
        const markMessagesAsRead = () => {
            messages.forEach(msg => {
                if (msg.senderId !== userId && !msg.isRead) {
                    socket.emit('markAsRead', { messageId: msg._id, userId });
                }
            });
        };

        if (conversationId) {
            markMessagesAsRead();
        }
    }, [messages, conversationId, userId]);

    // Handle sending message
    const handleSendMessage = () => {
        if (!newMessage.trim() || !conversationId || !receiverId) return;

        socket.emit("sendMessage", {
            conversationId,
            senderId: userId,
            receiverId,
            message: newMessage.trim(),
        });

        socket.emit("getConversations", userId);

        setNewMessage("");
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        if (showEmojiPicker) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showEmojiPicker]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const filterUsers = (users: { _id: string; name: string }[]) => {
        return users.filter(user =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    useEffect(() => {
        socket.on('unreadCounts', (counts: Array<{ otherUserId: string, count: number }>) => {
            const countsMap = counts.reduce((acc, curr) => ({
                ...acc,
                [curr.otherUserId]: curr.count
            }), {});
            setUnreadCounts(countsMap);
        });
    
        return () => {
            socket.off('unreadCounts');
        };
    }, []);

    useEffect(() => {
        socket.on("messageDeleted", ({ messageId }) => {
            // Update messages list
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg._id === messageId ? {
                        ...msg,
                        message: "This message was deleted",
                        mediaUrl: null as unknown as string,  
                        mediaType: null as unknown as string  
                    } : msg
                )
            );

            // Update conversations list
            setConversations((prevConversations) =>
                prevConversations.map((conv) => {
                    const lastMsg = messages.find(m => m._id === messageId);
                    if (lastMsg && conv.lastMessage === lastMsg.message) {
                        return {
                            ...conv,
                            lastMessage: "This message was deleted",
                            mediaUrl: null as unknown as string, 
                            mediaType: null as unknown as string 
                        };
                    }
                    return conv;
                })
            );
            socket.emit("getConversations", userId);
        });

        return () => {
            socket.off("messageDeleted");
        };
    }, [messages]);

    const handleDeleteMessage = (messageId: string) => {
        socket.emit("deleteMessage", { messageId, userId });
    };

    const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file type and size
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!isImage && !isVideo) {
            toast.error('Please select an image or video file');
            return;
        }

        if (file.size > maxSize) {
            toast.error('File size should be less than 5MB');
            return;
        }

        setSelectedMedia(file);
        const previewUrl = URL.createObjectURL(file);
        setMediaPreview(previewUrl);
        setIsAttachmentOpen(false);
    };

    const handleMediaUpload = async () => {
        if (!selectedMedia || !conversationId || !receiverId) return;

        setIsUploading(true);
        try {
            const { mediaUrl } = await uploadChatMedia(selectedMedia);
            
            const mediaType = selectedMedia.type.startsWith('image/') ? 'image' : 'video';
    
            socket.emit("sendMessage", {
                conversationId,
                senderId: userId,
                receiverId,
                message: "",
                mediaType,
                mediaUrl
            });
    
            // Clear media preview
            setSelectedMedia(null);
            setMediaPreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Error uploading media:', error);
            toast.error('Failed to upload media');
        } finally {
            setIsUploading(false);
        }
    };

    const cancelMediaPreview = () => {
        setSelectedMedia(null);
        setMediaPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="h-screen bg-gray-900 flex">
            {/* Left Sidebar - Contact List */}
            <div className={`w-full md:w-[350px] dark:bg-gray-900 bg-gray-50 border-r border-gray-700 flex flex-col h-full 
                ${showMobileChat ? 'hidden md:flex' : 'flex'}`}>
                {/* Header */}
                <div className="p-4 bg-gray-850 border-b border-gray-700">
                    <h2 className="text-xl font-semibold text-white">Messages</h2>
                </div>

                {loading ? (
                    <UserListSkeleton />
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-screen text-center space-y-4">
                        <TbMessageOff className="w-10 h-10 text-gray-400" />
                        <p className="text-gray-500">{error}</p>
                        <span onClick={() => navigate(-1)} className="hover:underline cursor-pointer">Go back</span>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto">
                        <div className="relative px-4 pt-4">
                            <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400 mt-2" />
                            <Input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search for ${role === "client" ? "freelancer" : "client"}`}
                                className="w-full pl-8 pr-4 py-2.5 rounded-md bg-gray-50 dark:bg-gray-800 text-sm dark:text-white text-gray-900 
                                placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:ring-0 focus:outline-none"
                            />
                        </div>

                        {/* Users List */}
                        {role === "client" && (
                            <div className="p-4">
                                {/* <h3 className="text-sm font-medium dark:text-gray-300 text-gray-900 mb-3">Your Freelancers</h3> */}
                                <div className="space-y-2">
                                    {filterUsers(freelancers)
                                        .sort((a, b) => {
                                            const convoA = conversations.find(c => c.otherUserId === a._id);
                                            const convoB = conversations.find(c => c.otherUserId === b._id);
                                            return new Date(convoB?.updatedAt || 0).getTime() - new Date(convoA?.updatedAt || 0).getTime();
                                        }).map((freelancer) => (
                                            <div
                                                key={freelancer._id}
                                                onClick={() => handleUserSelect(freelancer._id)}
                                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                                                ${freelancer._id === receiverId
                                                        ? 'dark:bg-gray-700 bg-gray-300'
                                                        : 'dark:hover:bg-gray-700 hover:bg-gray-300'}`}
                                            >
                                                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-white">
                                                        {freelancer.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="dark:text-white font-medium">{freelancer.name}</h4>
                                                    <p className="text-sm dark:text-gray-400 text-gray-600">
                                                        {getLastMessage(freelancer._id).message}
                                                        {getLastMessage(freelancer._id).message !== "No messages yet" && (
                                                            <span className={`ml-2 font-semibold text-[13px] ${unreadCounts[freelancer._id] > 0 ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                {getLastMessage(freelancer._id).time}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                {unreadCounts[freelancer._id] > 0 && (
                                                    <div className="bg-red-500 text-white text-xs font-medium px-2 min-w-[1.75rem] h-7 rounded-full flex items-center justify-center">
                                                        {unreadCounts[freelancer._id]}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {role === "freelancer" && (
                            <div className="p-4">
                                <h3 className="text-sm font-medium dark:text-gray-300 text-gray-900 mb-3">Your Clients</h3>
                                <div className="space-y-2">
                                    {filterUsers(clients)
                                        .sort((a, b) => {
                                            const convoA = conversations.find(c => c.otherUserId === a._id);
                                            const convoB = conversations.find(c => c.otherUserId === b._id);
                                            return new Date(convoB?.updatedAt || 0).getTime() - new Date(convoA?.updatedAt || 0).getTime();
                                        }).map((client) => (
                                            <div
                                                key={client._id}
                                                onClick={() => handleUserSelect(client._id)}
                                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors
                                                ${client._id === receiverId
                                                        ? 'dark:bg-gray-700 bg-gray-300'
                                                        : 'dark:hover:bg-gray-700 hover:bg-gray-300'}`}
                                            >
                                                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                                                    <span className="text-lg font-semibold text-white">
                                                        {client.name.charAt(0)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h4 className="dark:text-white text-gray-900 font-medium">{client.name}</h4>
                                                    <p className="text-sm dark:text-gray-400 text-gray-600">
                                                        {getLastMessage(client._id).message}
                                                        {getLastMessage(client._id).message !== "No messages yet" && (
                                                            <span className={`ml-2 font-semibold text-[13px] ${unreadCounts[client._id] > 0 ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                                                                {getLastMessage(client._id).time}
                                                            </span>
                                                        )}
                                                    </p>
                                                </div>
                                                {unreadCounts[client._id] > 0 && (
                                                    <div className="bg-red-500 text-white text-xs font-medium px-2 min-w-[1.75rem] h-7 rounded-full flex items-center justify-center">
                                                        {unreadCounts[client._id]}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Side - Chat Window */}
            <div className={`w-full flex flex-col flex-1 h-full bg-repeat bg-gray-850
                ${showMobileChat ? 'flex' : 'hidden md:flex'}`}>

                {!conversationId ? (
                    <div className="h-full flex items-center justify-center dark:bg-gray-900 bg-gray-50 ">
                        <div className="text-center dark:text-gray-400 text-gray-900">
                            <h3 className="text-xl font-semibold mb-2">Welcome to Chat</h3>
                            <p>Select a conversation to start messaging</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 dark:bg-gray-800 border-b bg-gray-50 border-gray-700 flex items-center justify-between fixed top-0 w-full z-10 mt-16">
                            <div className="flex items-center">
                                {/* Mobile Back Button */}
                                {showMobileChat && (
                                    <button
                                        onClick={() => setShowMobileChat(false)}
                                        className="md:hidden mr-2 dark:text-gray-200 dark:hover:text-white hover:text-gray-900 text-gray-600"
                                    >
                                        <IoIosArrowBack />
                                    </button>
                                )
                                }
                                {/* User Avatar and Info */}
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                                        <span className="text-white font-semibold">
                                            {role === "client"
                                                ? freelancers.find(f => f._id === receiverId)?.name.charAt(0)
                                                : clients.find(c => c._id === receiverId)?.name.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="dark:text-white font-medium text-gray-900">
                                            {role === "client"
                                                ? freelancers.find(f => f._id === receiverId)?.name
                                                : clients.find(c => c._id === receiverId)?.name}
                                        </h3>
                                        {/* <p className="text-xs text-gray-400">
                                            {role === "client" ? "Freelancer" : "Client"}
                                        </p> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message container */}
                        <div className={`flex-1 overflow-y-auto p-4 space-y-4 bg-cover bg-no-repeat bg-center mt-16`}
                            style={{
                                backgroundImage: `url(${theme === 'dark' ? chatDark : chatWhite})`,
                            }}
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg._id}
                                    className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`relative w-fit max-w-[85%] sm:max-w-[70%] mt-4 sm:mt-20 rounded-lg p-3 break-words overflow-hidden whitespace-pre-wrap ${msg.senderId === userId
                                            ? 'bg-[#005d4b] rounded-br-none'
                                            : 'bg-[#4a5053] rounded-bl-none'
                                            }`}
                                    >

                                        {msg.mediaUrl && (
                                            <div className="mb-2">
                                                {msg.mediaType === 'image' ? (
                                                    <>
                                                        <img
                                                            src={msg.mediaUrl}
                                                            alt="Shared image"
                                                            className="w-full max-w-[300px] max-h-[300px] sm:w-auto sm:max-w-[270px] sm:max-h-[270px] rounded-lg cursor-pointer object-cover"
                                                            loading="lazy"
                                                            onClick={() => {
                                                                setSelectedImageUrl(msg.mediaUrl);
                                                                setIsModalOpen(true);
                                                            }}
                                                        />
                                                        {isModalOpen && selectedImageUrl === msg.mediaUrl && (
                                                            <div
                                                                className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                                                                onClick={() => setIsModalOpen(false)}
                                                            >
                                                                <div className="max-w-[90vw] max-h-[90vh] relative">
                                                                    <button
                                                                        className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-2"
                                                                        onClick={() => setIsModalOpen(false)}
                                                                    >
                                                                        ×
                                                                    </button>
                                                                    <img
                                                                        src={selectedImageUrl}
                                                                        alt="Full size"
                                                                        className="max-w-full max-h-[90vh] object-contain rounded-lg"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                ) : msg.mediaType === 'video' && (
                                                    <video
                                                        src={msg.mediaUrl}
                                                        controls
                                                        className="w-full max-w-[90vw] max-h-[60vh] sm:max-w-[250px] sm:max-h-[250px] rounded-lg"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                )}
                                            </div>
                                        )}

                                        <p className={`flex items-center gap-1 ${msg.message === "This message was deleted" ? "italic text-gray-300" : "text-white"}`}>
                                            {msg.message === "This message was deleted" && <AiOutlineStop className="w-4 h-4" />}
                                            {msg.message}
                                        </p>

                                        {/* Time and Read Status */}
                                        <div className="flex items-center justify-end gap-1 mt-1">
                                            <p className="text-xs text-gray-300">
                                                {new Date(msg.createdAt).toLocaleTimeString('en-US', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}
                                            </p>
                                            {msg.senderId === userId && (
                                                <span className="ml-1">
                                                    <IoCheckmarkDone
                                                        className={`w-4 h-4 ${msg.isRead ? 'text-blue-400' : 'text-gray-400'}`}
                                                    />
                                                </span>
                                            )}
                                        </div>

                                        {msg.senderId === userId && msg.message !== "This message was deleted" && (
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <button
                                                        className="absolute top-1 right-1 p-1 hover:bg-white/10 rounded-full transition"
                                                    >
                                                        <Trash2 className="w-4 h-4 text-green-600 hover:green-300" />
                                                    </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="dark:bg-gray-900 dark:text-white">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={() => handleDeleteMessage(msg._id)}>
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Chat Input */}
                        <div className="relative p-4 bg-gray-100 border-t border-gray-400 dark:bg-gray-900 dark:border-gray-700">
                            {/* Emoji Picker */}
                            {showEmojiPicker && (
                                <div ref={emojiRef} className="absolute bottom-16 right-16 z-50">
                                    <Picker
                                        onEmojiSelect={(emoji: any) =>
                                            setNewMessage((prev) => prev + emoji.native)
                                        }
                                        theme={theme === "dark" ? "dark" : "light"}
                                    />
                                </div>
                            )}

                            {mediaPreview && (
                                <div className="absolute bottom-20 left-0 p-4 dark:bg-gray-800 bg-gray-300 rounded-lg">
                                    <div className="relative">
                                        {selectedMedia?.type.startsWith('image/') ? (
                                            <div className="relative">
                                                <img
                                                    src={mediaPreview}
                                                    alt="Preview"
                                                    className={`max-w-xs h-auto rounded ${isUploading ? 'opacity-50' : ''}`}
                                                />
                                                {isUploading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                                                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="relative">
                                                <video
                                                    src={mediaPreview}
                                                    className={`max-w-xs h-auto rounded ${isUploading ? 'opacity-50' : ''}`}
                                                    controls
                                                />
                                                {isUploading && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded">
                                                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <button
                                            onClick={cancelMediaPreview}
                                            className="absolute -top-4 -right-2 text-2xl font-bold p-1.5"
                                            disabled={isUploading}
                                        >
                                            ×
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleMediaUpload}
                                        className="dark:text-gray-200 text-gray-600 p-2 transition"
                                        disabled={isUploading}
                                    >
                                        <SendHorizontal className="h-5 w-5" />
                                    </button>
                                </div>
                            )}

                            {/* Chat Input */}
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleMediaSelect}
                                    className="hidden"
                                />
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-gray-600 dark:text-gray-300"
                                >
                                    <Smile className="h-5 w-5" />
                                </button>
                                <Popover open={isAttachmentOpen} onOpenChange={setIsAttachmentOpen}>
                                    <PopoverTrigger asChild>
                                        <button
                                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
                                            <Paperclip className="h-5 w-5" />
                                        </button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-48 p-2 dark:bg-gray-800 bg-white"
                                        side="top"
                                        align="start"
                                    >
                                        <div className="space-y-2">
                                            <button
                                                onClick={() => {
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.accept = "image/*";
                                                        fileInputRef.current.click();
                                                    }
                                                }}
                                                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                            >
                                                <Image className="h-5 w-5" />
                                                <span className="text-sm dark:text-gray-200">Photo</span>
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (fileInputRef.current) {
                                                        fileInputRef.current.accept = "video/*";
                                                        fileInputRef.current.click();
                                                    }
                                                }}
                                                className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                                            >
                                                <FileVideo className="h-5 w-5" />
                                                <span className="text-sm dark:text-gray-200">Video</span>
                                            </button>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                {/* <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-gray-600 dark:text-gray-300"
                                >
                                    <Smile className="h-5 w-5" />
                                </button> */}

                                <Input
                                    placeholder="Type a message"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    className="p-4 h-10 flex-grow bg-transparent dark:bg-gray-800 bg-gray-200 dark:text-white text-gray-900 
                                    focus-visible:ring-0 focus-visible:outline-none focus:outline-none 
                                    focus:ring-0 focus:ring-transparent focus:border-none focus:shadow-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />

                                <button onClick={handleSendMessage} className="dark:text-gray-200 text-gray-600 p-2 transition">
                                    <SendHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Chat;