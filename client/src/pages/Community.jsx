import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Users,
    MessageSquare,
    Sparkles,
    Globe,
    ShieldCheck,
    ArrowRight,
    TrendingUp,
    Mail,
    Instagram,
    Twitter,
    Linkedin
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function Community() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className='min-h-screen bg-white dark:bg-[#020617] transition-colors duration-700 pt-24 pb-20 selection:bg-indigo-500/20'>
            {/* Decorative Blobs */}
            <div className='fixed inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[120px] animate-float' />
                <div className='absolute bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[120px] animate-float' style={{ animationDelay: '2s' }} />
            </div>

            <div className='max-w-7xl mx-auto px-6 relative z-10'>
                {/* Hero Section */}
                <section className='text-center space-y-8 mb-24'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4 shadow-xl'
                    >
                        <Sparkles className='h-3 w-3 fill-indigo-600' /> The Collective
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className='text-6xl sm:text-8xl lg:text-[100px] font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter'
                    >
                        Connect with <br />
                        <span className='text-gradient bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600'>the curators.</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed'
                    >
                        AwasMitra isn't just a platform—it's a community of elite real estate visionaries,
                        investors, and homeowners redefining the architecture of living.
                    </motion.p>
                </section>

                {/* Community Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {loading ? (
                        Array(8).fill(0).map((_, i) => (
                            <div key={i} className='glass-card h-[400px] rounded-[48px] animate-pulse opacity-50' />
                        ))
                    ) : (
                        users.map((user, index) => (
                            <motion.div
                                key={user._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                viewport={{ once: true }}
                                className='group glass-card p-8 rounded-[48px] border border-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500'
                            >
                                <div className='flex flex-col items-center text-center space-y-6'>
                                    <div className='relative'>
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className='w-32 h-32 rounded-3xl object-cover ring-4 ring-slate-50 dark:ring-white/5 group-hover:ring-indigo-500 transition-all duration-500'
                                        />
                                        <div className='absolute -bottom-2 -right-2 bg-emerald-500 h-6 w-6 rounded-full border-4 border-white dark:border-[#020617]' />
                                    </div>

                                    <div className='space-y-1'>
                                        <h3 className='text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>
                                            {user.username}
                                        </h3>
                                        <div className='flex items-center justify-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest'>
                                            <ShieldCheck className='h-3 w-3' /> Verified Member
                                        </div>
                                    </div>

                                    <div className='flex gap-4'>
                                        <SocialButton icon={Mail} />
                                        <SocialButton icon={Instagram} />
                                        <SocialButton icon={Twitter} />
                                    </div>

                                    <button
                                        onClick={() => navigate('/chat')}
                                        className='w-full bg-indigo-600 text-white font-black py-4 rounded-2xl uppercase tracking-widest text-[10px] hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 flex items-center justify-center gap-2'
                                    >
                                        <MessageSquare className='h-3.5 w-3.5' /> Send Message
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Global Impact Section */}
                <section className='mt-48 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center'>
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className='space-y-10'
                    >
                        <div className='space-y-6'>
                            <h2 className='text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter'>
                                A Network <br /> Without Borders.
                            </h2>
                            <div className='h-1 w-20 bg-indigo-600 rounded-full' />
                        </div>
                        <p className='text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed'>
                            Join thousands of curators who are finding, funding, and living in
                            the most extraordinary spaces on earth. Your community is waiting.
                        </p>
                        <div className='flex items-center gap-12'>
                            <div>
                                <div className='text-4xl font-black dark:text-white tracking-tighter'>4.8K+</div>
                                <div className='text-[10px] font-bold text-slate-400 uppercase tracking-widest underline decoration-indigo-500 underline-offset-4'>Curators Joined</div>
                            </div>
                            <div>
                                <div className='text-4xl font-black dark:text-white tracking-tighter'>120</div>
                                <div className='text-[10px] font-bold text-slate-400 uppercase tracking-widest underline decoration-indigo-500 underline-offset-4'>Countries Active</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className='relative bg-indigo-600 rounded-[64px] aspect-square overflow-hidden flex items-center justify-center'
                    >
                        <Globe className='h-64 w-64 text-white/10 absolute' />
                        <div className='relative z-10 text-center p-12 space-y-6'>
                            <div className='h-24 w-24 bg-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl'>
                                <TrendingUp className='h-12 w-12 text-indigo-600' />
                            </div>
                            <h3 className='text-3xl font-black text-white uppercase tracking-tighter'>Growth & Connection</h3>
                        </div>
                    </motion.div>
                </section>
            </div>

            <div className='noise-bg' />
        </div>
    );
}

function SocialButton({ icon: Icon }) {
    return (
        <div className='h-10 w-10 glass-card rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-all cursor-pointer'>
            <Icon className='h-4 w-4' />
        </div>
    );
}
