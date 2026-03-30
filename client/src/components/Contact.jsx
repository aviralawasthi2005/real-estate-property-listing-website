import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User as UserIcon, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: landlord._id,
          message: message,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) return;
      navigate('/chat');
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {landlord && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className='flex flex-col gap-6 bg-slate-50 dark:bg-white/[0.03] p-8 rounded-[32px] border border-slate-200 dark:border-white/5 relative overflow-hidden backdrop-blur-xl'
        >
          <div className='flex items-center gap-4 relative z-10'>
            <div className='h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/20'>
              <Sparkles className='h-6 w-6 text-white' />
            </div>
            <div className='space-y-1'>
              <p className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none'>Direct Concierge</p>
              <p className='text-sm font-bold text-slate-700 dark:text-slate-200'>
                Message <span className='text-indigo-600 dark:text-indigo-400'>{landlord.username}</span>
              </p>
            </div>
          </div>

          <textarea
            name='message'
            id='message'
            rows='4'
            value={message}
            onChange={onChange}
            placeholder='State your inquiry or request a private viewing...'
            className='w-full glass-card border-none p-5 rounded-2xl bg-white dark:bg-[#020617] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all dark:text-slate-200 resize-none font-medium text-slate-900 dark:text-slate-100'
          ></textarea>

          <button
            onClick={handleSendMessage}
            disabled={loading || !message.trim()}
            className='flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-5 px-8 rounded-2xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50 text-sm uppercase tracking-widest'
          >
            {loading ? <Loader2 className='h-5 w-5 animate-spin' /> : <Send className='h-5 w-5' />}
            {loading ? 'Transmitting...' : 'Initiate Contact'}
          </button>

          <div className='absolute -bottom-6 -right-6 h-24 w-24 bg-indigo-600/5 rounded-full blur-2xl pointer-events-none' />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
