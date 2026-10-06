import { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, ArrowRightCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils/cn';
import { Link } from 'react-router-dom';
import api from '../services/api.client';

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Hello! I am your Real Estate assistant. How can I help you today?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        const query = input.trim();
        if (!query) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: query,
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await getBotResponse(query);
            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: response.text,
                listings: response.listings,
                timestamp: new Date()
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            setMessages((prev) => [...prev, {
                id: Date.now() + 1,
                type: 'bot',
                text: error instanceof Error ? error.message : 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const getBotResponse = async (query) => {
        const { text } = await api.chatbot.ask(query);
        const searchPattern = /\b(properties|property|listings?|houses?|homes?|apartments?|rent|rental|sale|buy|find|search|show)\b/i;
        let listings = null;
        let listingSearchError = '';

        if (searchPattern.test(query)) {
            const searchTerm = query
                .replace(/\b(?:properties|property|listings?|houses?|homes?|apartments?|rent|rental|sale|buy|find|search|show|please|me|for|in|near|can|i|get)\b/gi, ' ')
                .replace(/\s+/g, ' ')
                .trim();

            try {
                listings = await api.listings.getListings({ searchTerm, limit: 3 });
                if (listings.length === 0) listings = null;
            } catch (error) {
                console.error('Listing search error:', error);
                listingSearchError = error instanceof Error
                    ? `\n\nI couldn't load matching listings: ${error.message}`
                    : "\n\nI couldn't load matching listings right now.";
            }
        }

        return { text: `${text}${listingSearchError}`, listings };
    };

    return (
        <div className='fixed bottom-6 right-6 z-[9999] flex flex-col items-end'>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className='mb-4 w-[350px] sm:w-[400px] h-[550px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border dark:border-slate-800 flex flex-col overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800'
                    >
                        {/* Header */}
                        <div className='p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between shadow-lg'>
                            <div className='flex items-center gap-3'>
                                <div className='bg-white/20 p-2 rounded-xl backdrop-blur-md'>
                                    <Bot className='h-6 w-6' />
                                </div>
                                <div>
                                    <h3 className='font-bold text-lg leading-tight'>Real Estate Assistant</h3>
                                    <p className='text-[10px] text-blue-100 uppercase tracking-widest font-bold'>Always Online</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='p-2 hover:bg-white/10 rounded-xl transition-colors'
                            >
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className='flex-1 p-5 overflow-y-auto space-y-4 custom-scrollbar dark:bg-slate-900/50'
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        'flex flex-col max-w-[85%]',
                                        msg.type === 'user' ? 'ml-auto items-end' : 'items-start'
                                    )}
                                >
                                    <div className={cn(
                                        'p-4 rounded-2xl shadow-sm leading-relaxed text-sm',
                                        msg.type === 'user'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border dark:border-slate-700'
                                    )}>
                                        {msg.text}
                                    </div>

                                    {msg.listings && (
                                        <div className='mt-3 space-y-3 w-full'>
                                            {msg.listings.map((listing) => (
                                                <Link
                                                    key={listing._id}
                                                    to={`/listing/${listing._id}`}
                                                    onClick={() => setIsOpen(false)}
                                                    className='flex gap-3 bg-white dark:bg-slate-800 p-2 rounded-xl border dark:border-slate-700 hover:border-blue-500 transition-all shadow-sm group'
                                                >
                                                    <img
                                                        src={listing.imageUrls[0]}
                                                        className='w-16 h-16 object-cover rounded-lg'
                                                        alt=''
                                                    />
                                                    <div className='flex-1 min-w-0'>
                                                        <p className='text-xs font-bold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600'>{listing.name}</p>
                                                        <p className='text-[10px] text-slate-500'>${listing.regularPrice.toLocaleString()}</p>
                                                        <div className='flex items-center gap-1 text-[10px] text-blue-600 font-bold mt-1'>
                                                            View Details <ArrowRightCircle className='h-3 w-3' />
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                    <span className='text-[10px] text-slate-400 mt-1 font-medium'>
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            {isLoading && (
                                <div className='flex flex-col items-start'>
                                    <div className='bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-2'>
                                        <Loader2 className='h-4 w-4 animate-spin text-blue-600' />
                                        <span className='text-xs text-slate-500'>Assistant is thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <form
                            onSubmit={handleSend}
                            className='p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700 flex gap-2 items-center'
                        >
                            <input
                                type='text'
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder='Type your message...'
                                className='flex-1 bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                            />
                            <button
                                type='submit'
                                disabled={!input.trim() || isLoading}
                                className='bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all shadow-lg active:scale-90 disabled:opacity-50 disabled:scale-100'
                            >
                                <Send className='h-5 w-5' />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform',
                    isOpen ? 'rotate-90 bg-red-500 from-red-500 to-red-600' : 'hover:scale-110'
                )}
            >
                {isOpen ? <X className='h-7 w-7' /> : <MessageSquare className='h-7 w-7' />}
            </button>
        </div>
    );
}
