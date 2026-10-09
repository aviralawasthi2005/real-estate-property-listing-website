import { Search as SearchIcon, Moon, Sun, Menu, X, Sparkles, PlusCircle, MessageSquare, Crown } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubscription } from '../hooks/useSubscription';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm.trim());
    navigate(`/search?${urlParams.toString()}`);
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
      'fixed top-0 left-0 right-0 z-[100] transition-all duration-300',
      isScrolled
        ? 'py-3 bg-white/85 dark:bg-[#07090e]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-sm'
        : 'py-5 bg-transparent'
    )}>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center gap-4'>
        {/* Brand Logo */}
        <Link to='/' className='group flex items-center gap-2.5 shrink-0'>
          <div className='h-10 w-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-300'>
            <Sparkles className='text-white h-5 w-5' />
          </div>
          <div className='flex flex-col'>
            <span className='font-black text-xl tracking-tight text-slate-900 dark:text-white leading-none font-sans'>
              Prime<span className='text-indigo-600 dark:text-indigo-400'>Estate</span>
            </span>
            <span className='text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500'>
              Luxury & Living
            </span>
          </div>
        </Link>

        {/* Desktop Quick Search */}
        <form onSubmit={handleSearchSubmit} className='hidden lg:flex items-center relative max-w-xs w-full'>
          <input
            type='text'
            placeholder='Search city, neighborhood...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full py-2 pl-9 pr-4 text-xs rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all'
          />
          <SearchIcon className='absolute left-3 top-2.5 h-4 w-4 text-slate-400' />
        </form>

        {/* Desktop Navigation Links */}
        <nav className='hidden md:flex items-center gap-1 p-1 bg-slate-100/70 dark:bg-slate-900/70 rounded-full border border-slate-200/80 dark:border-white/10 backdrop-blur-md'>
          <NavLink to='/' label='Home' active={location.pathname === '/'} />
          <NavLink to='/search' label='Properties' active={location.pathname === '/search'} />
          <NavLink to='/community' label='Community' active={location.pathname === '/community'} />
          <NavLink to='/about' label='About' active={location.pathname === '/about'} />
          {currentUser && (
            <NavLink to='/chat' label='Messages' active={location.pathname === '/chat'} />
          )}
        </nav>

        {/* Action Controls */}
        <div className='flex items-center gap-2.5 shrink-0'>
          {/* Create Listing Shortcut */}
          {currentUser && (
            <Link
              to='/create-listing'
              className='hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/60 transition-all active:scale-95'
            >
              <PlusCircle className='h-3.5 w-3.5' />
              <span>List Property</span>
            </Link>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label='Toggle theme'
            className='p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700/80 transition-all active:scale-95'
          >
            {theme === 'dark' ? <Sun className='h-4 w-4 text-amber-400' /> : <Moon className='h-4 w-4 text-indigo-600' />}
          </button>

          {/* User Profile / Auth Button */}
          <Link to='/profile'>
            {currentUser ? (
              <div className='relative group flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all'>
                <img
                  className='rounded-full h-8 w-8 object-cover ring-2 ring-indigo-500/40 group-hover:ring-indigo-500 transition-all'
                  src={currentUser.avatar}
                  alt='profile'
                />
                <span className='hidden lg:inline text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[90px] truncate'>
                  {currentUser.username}
                </span>
              </div>
            ) : (
              <div className='bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-5 py-2 rounded-xl font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition-all'>
                Sign In
              </div>
            )}
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label='Open navigation menu'
            className='md:hidden p-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/80'
          >
            {isMobileMenuOpen ? <X className='h-5 w-5' /> : <Menu className='h-5 w-5' />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className='absolute top-full left-0 right-0 p-4 md:hidden'
          >
            <div className='bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 space-y-3'>
              <form onSubmit={handleSearchSubmit} className='relative'>
                <input
                  type='text'
                  placeholder='Search properties...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full py-2.5 pl-9 pr-4 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 outline-none'
                />
                <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-slate-400' />
              </form>

              <ul className='space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800'>
                <MobileNavItem to='/' label='Home' onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem to='/search' label='Browse Properties' onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem to='/community' label='Community Feed' onClick={() => setIsMobileMenuOpen(false)} />
                <MobileNavItem to='/about' label='About Us' onClick={() => setIsMobileMenuOpen(false)} />
                {currentUser && (
                  <>
                    <MobileNavItem to='/chat' label='Real-Time Messages' onClick={() => setIsMobileMenuOpen(false)} />
                    <MobileNavItem to='/create-listing' label='+ List a New Property' onClick={() => setIsMobileMenuOpen(false)} />
                  </>
                )}
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
        'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
        active
          ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      )}
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className='block px-4 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-200 transition-colors'
    >
      {label}
    </Link>
  );
}
