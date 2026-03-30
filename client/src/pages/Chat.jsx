import { useEffect, useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Send,
    Search,
    UserPlus,
    Sparkles,
    ChevronLeft,
    MoreVertical,
    ShieldCheck,
    Zap,
    Globe,
    MessageSquare,
    Users
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function Chat() {
    const { currentUser } = useSelector((state) => state.user);
    const { socket, onlineUsers } = useSocket();
    const [conversations, setConversations] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState('conversations'); // 'conversations' or 'discover'
    const [searchTerm, setSearchTerm] = useState('');
    const lastMessageRef = useRef();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/messages/conversations');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setConversations(data);
                } else {
                    setConversations([]);
                }
            } catch (error) {
                console.log(error);
                setConversations([]);
            }
        };
        fetchConversations();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/user/get');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setUsers(data);
                } else {
                    setUsers([]);
                }
            } catch (error) {
                console.log(error);
                setUsers([]);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!selectedConversation) return;
            try {
                setLoading(true);
                const otherUserId = selectedConversation.participants?.[0]?._id;
                if (!otherUserId) return;
                const res = await fetch(`/api/messages/${otherUserId}`);
                const data = await res.json();
                setMessages(data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchMessages();
    }, [selectedConversation]);

    useEffect(() => {
        socket?.on('newMessage', (message) => {
            if (selectedConversation && message.conversationId === selectedConversation._id) {
                setMessages((prev) => [...prev, message]);
            }
            setConversations((prev) =>
                prev.map((conv) =>
                    conv._id === message.conversationId
                        ? { ...conv, lastMessage: { text: message.text, sender: message.sender } }
                        : conv
                )
            );
        });
        return () => socket?.off('newMessage');
    }, [socket, selectedConversation]);

    useEffect(() => {
        setTimeout(() => {
            lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation) return;

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    recipientId: selectedConversation.participants?.[0]?._id,
                    message: newMessage,
                }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, data]);
            setNewMessage('');

            setConversations((prev) => {
                const existing = prev.find(c => c._id === selectedConversation._id);
                if (existing) {
                    return prev.map((conv) =>
                        conv._id === selectedConversation._id
                            ? { ...conv, lastMessage: { text: data.text, sender: data.sender } }
                            : conv
                    );
                } else {
                    // This was a newly created conversation from discovery
                    return [{
                        _id: data.conversationId,
                        participants: selectedConversation.participants,
                        lastMessage: { text: data.text, sender: data.sender }
                    }, ...prev];
                }
            });

            // If the conversation was temporary (from discovery), update selected with its ID
            if (!selectedConversation._id) {
                setSelectedConversation(prev => ({ ...prev, _id: data.conversationId }));
            }

        } catch (error) {
            console.log(error);
        }
    };

    const handleSelectUser = (user) => {
        // Check if conversation already exists
        const existing = conversations.find(c =>
            c.participants.some(p => p._id === user._id)
        );

        if (existing) {
            setSelectedConversation(existing);
        } else {
            // Placeholder conversation
            setSelectedConversation({
                _id: null,
                participants: [user],
                lastMessage: null
            });
        }
        setTab('conversations');
    };

    const filteredConversations = useMemo(() => {
        return conversations.filter(c =>
            c.participants?.[0]?.username?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [conversations, searchTerm]);

    const filteredUsers = useMemo(() => {
        return users.filter(u =>
            u.username.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    return (
        <div className='min-h-screen bg-white dark:bg-[#020617] transition-colors duration-700 pt-24 pb-8 selection:bg-indigo-500/20'>
            <div className='max-w-7xl mx-auto px-6 h-[calc(100vh-160px)] flex gap-8 relative z-10'>

                {/* Sidebar */}
                <div className='w-full md:w-80 lg:w-[400px] flex flex-col gap-6'>
                    <div className='glass-card rounded-[40px] p-8 flex flex-col gap-8 h-full border border-white/10 dark:border-white/5'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20'>
                                    <Sparkles className='text-white h-5 w-5' />
                                </div>
                                <h2 className='text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Concierge</h2>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className='flex p-1 bg-slate-100 dark:bg-white/5 rounded-2xl'>
                            <button
                                onClick={() => setTab('conversations')}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                                    tab === 'conversations' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xl' : 'text-slate-500 dark:text-slate-400'
                                )}
                            >
                                <MessageSquare className='h-3.5 w-3.5' /> Private
                            </button>
                            <button
                                onClick={() => setTab('discover')}
                                className={cn(
                                    'flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all',
                                    tab === 'discover' ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-xl' : 'text-slate-500 dark:text-slate-400'
                                )}
                            >
                                <Users className='h-3.5 w-3.5' /> Discovery
                            </button>
                        </div>

                        {/* Search */}
                        <div className='relative group'>
                            <input
                                type='text'
                                placeholder={tab === 'conversations' ? 'Find conversation...' : 'Locate curators...'}
                                className='w-full bg-slate-100 dark:bg-white/5 border-none rounded-2xl p-4 pl-12 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className='absolute left-4 top-4 h-4 w-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors' />
                        </div>

                        {/* List Area */}
                        <div className='flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar'>
                            <AnimatePresence mode='wait'>
                                {tab === 'conversations' ? (
                                    <motion.div
                                        key='convs'
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className='space-y-3'
                                    >
                                        {filteredConversations.map((conv) => (
                                            <button
                                                key={conv._id}
                                                onClick={() => setSelectedConversation(conv)}
                                                className={cn(
                                                    'w-full p-4 flex items-center gap-4 rounded-[28px] transition-all duration-500 group relative',
                                                    selectedConversation?._id === conv._id
                                                        ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20'
                                                        : 'hover:bg-slate-100 dark:hover:bg-white/5'
                                                )}
                                            >
                                                <div className='relative shrink-0'>
                                                    <img
                                                        src={conv.participants?.[0]?.avatar}
                                                        alt='avatar'
                                                        className='w-14 h-14 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all'
                                                    />
                                                    {onlineUsers.includes(conv.participants?.[0]?._id) && (
                                                        <div className='absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white dark:border-[#101323]'></div>
                                                    )}
                                                </div>
                                                <div className='text-left min-w-0 flex-1'>
                                                    <p className={cn(
                                                        'font-black text-sm tracking-tight truncate uppercase',
                                                        selectedConversation?._id === conv._id ? 'text-white' : 'text-slate-900 dark:text-white'
                                                    )}>
                                                        {conv.participants?.[0]?.username}
                                                    </p>
                                                    <p className={cn(
                                                        'text-xs truncate font-medium',
                                                        selectedConversation?._id === conv._id ? 'text-indigo-100' : 'text-slate-400'
                                                    )}>
                                                        {conv.lastMessage?.sender === currentUser._id && 'You: '}{conv.lastMessage?.text || 'Access initiated...'}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key='discover'
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 10 }}
                                        className='space-y-4'
                                    >
                                        <div className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6'>Verified Members</div>
                                        {filteredUsers.map((user) => (
                                            <button
                                                key={user._id}
                                                onClick={() => handleSelectUser(user)}
                                                className='w-full p-4 flex items-center gap-4 rounded-[28px] hover:bg-slate-100 dark:hover:bg-white/5 transition-all group'
                                            >
                                                <img
                                                    src={user.avatar}
                                                    alt='avatar'
                                                    className='w-14 h-14 rounded-2xl object-cover'
                                                />
                                                <div className='text-left'>
                                                    <p className='font-black text-sm tracking-tight text-slate-900 dark:text-white uppercase'>{user.username}</p>
                                                    <p className='text-[10px] font-bold text-indigo-500 uppercase tracking-widest'>Elite Member</p>
                                                </div>
                                                <UserPlus className='h-4 w-4 ml-auto text-slate-300 group-hover:text-indigo-600 transition-colors' />
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Main Chat Area */}
                <div className='flex-1 glass-card rounded-[40px] flex flex-col overflow-hidden relative border border-white/10 dark:border-white/5'>
                    <AnimatePresence mode='wait'>
                        {selectedConversation ? (
                            <motion.div
                                key={selectedConversation._id || selectedConversation.participants[0]._id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className='flex flex-col h-full'
                            >
                                {/* Header */}
                                <div className='p-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-white/50 dark:bg-transparent backdrop-blur-md'>
                                    <div className='flex items-center gap-4'>
                                        <img
                                            src={selectedConversation.participants?.[0]?.avatar}
                                            alt='avatar'
                                            className='w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-xl'
                                        />
                                        <div>
                                            <div className='flex items-center gap-2'>
                                                <h3 className='text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>
                                                    {selectedConversation.participants?.[0]?.username}
                                                </h3>
                                                <ShieldCheck className='h-4 w-4 text-indigo-500' />
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                <div className={cn(
                                                    'h-1.5 w-1.5 rounded-full',
                                                    onlineUsers.includes(selectedConversation.participants?.[0]?._id) ? 'bg-emerald-500 scale-110 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'
                                                )} />
                                                <span className='text-[10px] font-black uppercase tracking-widest text-slate-400'>
                                                    {onlineUsers.includes(selectedConversation.participants?.[0]?._id) ? 'Direct Connection Active' : 'Offline Mode'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <button className='p-3 rounded-2xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-indigo-600 transition-colors'>
                                            <MoreVertical className='h-5 w-5' />
                                        </button>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className='flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar'>
                                    {messages.length === 0 && !loading && (
                                        <div className='h-full flex flex-col items-center justify-center text-center space-y-6 max-w-sm mx-auto opacity-50'>
                                            <div className='h-20 w-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center'>
                                                <Zap className='h-10 w-10 text-indigo-600' />
                                            </div>
                                            <div className='space-y-2'>
                                                <p className='text-lg font-black dark:text-white uppercase tracking-tighter'>Encrypted Channel</p>
                                                <p className='text-xs font-medium text-slate-400'>State your inquiry. This channel is monitored for architectural excellence and private discretion.</p>
                                            </div>
                                        </div>
                                    )}

                                    {messages.map((msg, index) => (
                                        <motion.div
                                            key={msg._id || index}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            ref={index === messages.length - 1 ? lastMessageRef : null}
                                            className={cn(
                                                'max-w-[75%] p-5 rounded-[28px] text-sm font-medium relative shadow-sm',
                                                msg.sender === currentUser._id
                                                    ? 'bg-indigo-600 text-white self-end rounded-tr-none'
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-slate-200 self-start rounded-tl-none border border-black/5 dark:border-white/5'
                                            )}
                                        >
                                            {msg.text}
                                            <div className={cn(
                                                'mt-1 text-[9px] font-black uppercase tracking-widest opacity-40',
                                                msg.sender === currentUser._id ? 'text-right' : 'text-left'
                                            )}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </motion.div>
                                    ))}
                                    {loading && (
                                        <div className='flex justify-center py-4'>
                                            <div className='flex gap-1'>
                                                <div className='h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce' />
                                                <div className='h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]' />
                                                <div className='h-1.5 w-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]' />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Input */}
                                <div className='p-8 pt-4'>
                                    <form onSubmit={handleSendMessage} className='relative group'>
                                        <input
                                            type='text'
                                            placeholder='Transmit private message...'
                                            className='w-full bg-slate-100 dark:bg-white/5 border-none rounded-[32px] py-6 px-8 pr-20 text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none dark:text-white transition-all shadow-inner'
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                        />
                                        <button
                                            disabled={!newMessage.trim()}
                                            className='absolute right-3 top-3 bottom-3 aspect-square bg-indigo-600 text-white rounded-[24px] flex items-center justify-center hover:bg-white hover:text-indigo-600 transition-all shadow-xl active:scale-90 disabled:opacity-50 group-hover:shadow-indigo-600/20'
                                        >
                                            <Send className='h-5 w-5' />
                                        </button>
                                    </form>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className='flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8'
                            >
                                <div className='relative'>
                                    <div className='h-32 w-32 bg-indigo-600/10 rounded-[50px] flex items-center justify-center relative z-10 animate-float'>
                                        <Globe className='h-12 w-12 text-indigo-600' />
                                    </div>
                                    <div className='absolute inset-0 bg-indigo-500/20 blur-[60px] rounded-full' />
                                </div>
                                <div className='space-y-4 max-w-sm'>
                                    <h2 className='text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase'>AwasMitra Net</h2>
                                    <p className='text-slate-500 dark:text-slate-400 font-medium leading-relaxed uppercase tracking-widest text-[10px]'>
                                        Initiate a secure terminal with a concierge or curator to begin your architectural acquisition.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Background Decoration */}
            <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none -z-10 group-hover:opacity-100 opacity-50 transition-opacity duration-1000'>
                <div className='absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/5 rounded-full blur-[140px] animate-float' />
                <div className='absolute bottom-0 left-0 w-[40%] h-[40%] bg-violet-600/5 rounded-full blur-[140px] animate-float' style={{ animationDelay: '2s' }} />
            </div>

            <div className='noise-bg z-0' />
        </div>
    );
}
