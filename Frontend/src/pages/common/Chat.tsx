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
import { Search, SendHorizontal, Smile, Trash2 } from 'lucide-react';
import Picker from '@emoji-mart/react'
import { IoCheckmarkDone } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { AiOutlineStop } from "react-icons/ai";
import { TbMessageOff } from "react-icons/tb";
import {
    AlertDialog, AlertDialogTrigger, AlertDialogContent,
    AlertDialogHeader, AlertDialogTitle, AlertDialogFooter,
    AlertDialogCancel, AlertDialogAction
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

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
        });

        socket.on("newMessage", (incomingMessage: MessageType) => {
            setMessages((prev) => [...prev, incomingMessage]);
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
        socket.on("messageDeleted", ({ messageId, message }) => {
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg._id === messageId ? { ...msg, message } : msg
                )
            );
        });

        return () => {
            socket.off("messageDeleted");
        };
    }, []);

    const handleDeleteMessage = (messageId: string) => {
        console.log('aaaaaaaa', messageId);
        socket.emit("deleteMessage", { messageId, userId });
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
                                    {filterUsers(freelancers).map((freelancer) => (
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
                                    {filterUsers(clients).map((client) => (
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
                {/* Add back button for mobile */}
                {/* {showMobileChat && (
                    <button
                        onClick={() => setShowMobileChat(false)}
                        className="md:hidden p-2 mt-16 text-left w-full text-white dark:bg-gray-800"
                    >
                        ← Back to conversations
                    </button>
                )} */}

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

                            {/* Chat Input */}
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="text-gray-600 dark:text-gray-300"
                                >
                                    <Smile className="h-5 w-5" />
                                </button>

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