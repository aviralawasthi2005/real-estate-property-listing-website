import { Search as SearchIcon, Moon, Sun, Menu, X, Globe, Sparkles } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
      isScrolled
        ? 'py-3 bg-white/70 dark:bg-slate-950/70 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]'
        : 'py-6 bg-transparent'
    )}>
      <div className='max-w-7xl mx-auto px-6 flex justify-between items-center'>
        {/* Logo */}
        <Link to='/' className='group relative z-10'>
          <div className='flex items-center gap-2'>
            <div className='h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:rotate-12 transition-transform duration-500'>
              <Sparkles className='text-white h-6 w-6' />
            </div>
            <h1 className='font-black text-2xl tracking-tighter text-slate-900 dark:text-white uppercase'>
              AwasMitra
            </h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className='hidden md:flex items-center gap-1 p-1 bg-slate-100/50 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 backdrop-blur-md'>
          <NavLink to='/' label='Lounge' active={location.pathname === '/'} />
          <NavLink to='/community' label='Collective' active={location.pathname === '/community'} />
          <NavLink to='/search' label='Aesthetics' active={location.pathname === '/search'} />
          <NavLink to='/about' label='Philosophy' active={location.pathname === '/about'} />
        </nav>

        {/* Actions */}
        <div className='flex items-center gap-3 relative z-10'>
          <button
            onClick={toggleTheme}
            className='p-3 rounded-2xl bg-slate-100/50 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all active:scale-95 border border-transparent dark:border-white/5'
          >
            {theme === 'dark' ? <Sun className='h-5 w-5' /> : <Moon className='h-5 w-5' />}
          </button>

          <div className='hidden sm:flex h-8 w-[1px] bg-slate-200 dark:bg-white/10 mx-2' />

          <Link to='/profile'>
            {currentUser ? (
              <div className='relative group'>
                <img
                  className='rounded-2xl h-11 w-11 object-cover ring-2 ring-transparent group-hover:ring-indigo-500 transition-all shadow-xl'
                  src={currentUser.avatar}
                  alt='profile'
                />
                <div className='absolute inset-0 rounded-2xl bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity' />
              </div>
            ) : (
              <div className='bg-indigo-600 text-white px-8 py-3 rounded-2xl hover:bg-indigo-500 transition-all font-bold text-sm shadow-lg shadow-indigo-600/20 active:scale-95'>
                Join Club
              </div>
            )}
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='md:hidden p-3 rounded-2xl bg-slate-100/50 dark:bg-white/5 text-slate-600 dark:text-slate-300'
          >
            {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='absolute top-full left-0 right-0 p-6 md:hidden'
          >
            <div className='bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 space-y-4'>
              <ul className='space-y-2'>
                <MobileNavItem to='/' label='Lounge' onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem to='/search' label='Aesthetics' onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem to='/about' label='Philosophy' onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem to='/community' label='Collective' onClick={() => setIsMobileMenuOpen(false)} />
                {currentUser && <MobileNavItem to='/chat' label='Concierge' onClick={() => setIsMobileMenuOpen(false)} />}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ to, label, active }) {
  return (
    <Link
      to={to}
      className={cn(
        'px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300',
        active
          ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ to, label, onClick }) {
  return (
    <Link to={to} onClick={onClick} className='block p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 text-lg font-bold text-slate-800 dark:text-slate-200 transition-colors'>
      {label}
    </Link>
  );
}
