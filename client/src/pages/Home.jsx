import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';
import SkeletonListing from '../components/SkeletonListing';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Home as HomeIcon,
  Key,
  TrendingUp,
  Search,
  Users,
  Globe,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Activity,
  Award,
  ArrowUpRight
} from 'lucide-react';

const LISTING_LIMITS = {
  OFFER: 4,
  RENT: 4,
  SALE: 4
};

const ANIMATION_VARIANTS = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  },
  item: {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  }
};

const LISTING_SECTIONS = [
  {
    id: 'offers',
    title: 'Limited Opportunities',
    subtitle: "Precision-curated luxury listings with exclusive pricing.",
    icon: Star,
    badge: 'Elite Offers',
    searchParam: 'offer=true',
  },
  {
    id: 'rent',
    title: 'Exquisite Rentals',
    subtitle: 'Exceptional living spaces tailored for temporary residencies.',
    icon: Key,
    badge: 'New Availability',
    searchParam: 'type=rent',
  },
  {
    id: 'sale',
    title: 'Premium Acquisitions',
    subtitle: 'Own a masterpiece properties in the world’s most sought-after locations.',
    icon: HomeIcon,
    badge: 'Curated Assets',
    searchParam: 'type=sale',
  }
];

export default function Home() {
  const [listings, setListings] = useState({ offers: [], rent: [], sale: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllListings = useCallback(async () => {
    setLoading(true);
    try {
      const [offerRes, rentRes, saleRes] = await Promise.all([
        fetch(`/api/listing/get?offer=true&limit=${LISTING_LIMITS.OFFER}`),
        fetch(`/api/listing/get?type=rent&limit=${LISTING_LIMITS.RENT}`),
        fetch(`/api/listing/get?type=sale&limit=${LISTING_LIMITS.SALE}`)
      ]);

      if (!offerRes.ok || !rentRes.ok || !saleRes.ok) throw new Error('Network synchronization failed');

      const [offerData, rentData, saleData] = await Promise.all([
        offerRes.json(),
        rentRes.json(),
        saleRes.json()
      ]);

      setListings({ offers: offerData, rent: rentData, sale: saleData });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllListings();
  }, [fetchAllListings]);

  const skeletonArray = useMemo(() => Array(4).fill(0), []);

  return (
    <div className='min-h-screen bg-white dark:bg-[#020617] transition-colors duration-700 selection:bg-indigo-500/20 font-sans'>

      <HeroSection listings={listings.offers} />

      <motion.div
        variants={ANIMATION_VARIANTS.container}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true, amount: 0.1 }}
        className='max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-20 relative z-10 space-y-40 lg:space-y-64 pb-40 pt-20'
      >

        {LISTING_SECTIONS.map((section) => (
          <ListingSection
            key={section.id}
            section={section}
            listings={listings[section.id]}
            loading={loading}
            skeletonArray={skeletonArray}
          />
        ))}

        {error && <ErrorState error={error} onRetry={fetchAllListings} />}

        <ValueProps />
        <StatsSection />
      </motion.div>

      <CTASection />

      {/* Noise Texture layer */}
      <div className='noise-bg' />
    </div>
  );
}

function HeroSection({ listings }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  // Fallback images if no listings
  const heroImages = listings?.length > 0
    ? listings.map(l => l.imageUrls[0])
    : [
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2700&auto=format&fit=crop'
    ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?searchTerm=${searchTerm}`);
    }
  };

  return (
    <section className='relative h-[100vh] min-h-[800px] flex flex-col items-center justify-center overflow-hidden'>
      {/* Background Slideshow */}
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
          className='absolute inset-0 z-0'
        >
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${heroImages[activeSlide]})` }}
          />
          <div className='absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-[#020617] z-10' />
        </motion.div>
      </AnimatePresence>

      <div className='relative z-20 w-full max-w-7xl mx-auto px-6 text-center space-y-12'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className='space-y-6'
        >
          <div className='inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white/80 text-xs font-bold uppercase tracking-[0.2em]'>
            <div className='h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse' />
            AwasMitra Intelligence Active
          </div>

          <h1 className='text-6xl sm:text-8xl lg:text-[110px] font-black tracking-tighter leading-[0.9] text-white drop-shadow-2xl'>
            The Architecture <br /> of <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-white to-indigo-300'>Wealth.</span>
          </h1>

          <p className='text-xl text-white/70 max-w-2xl mx-auto font-medium leading-relaxed tracking-wide'>
            Access the world’s most exclusive off-market assets. <br className='hidden md:block' />
            Powered by proprietary valuation algorithms.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className='max-w-3xl mx-auto'
        >
          <form onSubmit={handleSearch} className='group relative'>
            <div className='absolute -inset-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-[34px] blur opacity-25 group-hover:opacity-50 transition duration-1000'></div>
            <div className='relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-2 pr-2 transition-all duration-300 focus-within:bg-white/20 focus-within:border-white/40 shadow-2xl'>
              <div className='pl-6 pr-4'>
                <Search className='h-6 w-6 text-white/50' />
              </div>
              <input
                type='text'
                placeholder='City, Address, or Asset ID...'
                className='w-full bg-transparent border-none text-white placeholder:text-white/50 text-lg h-14 focus:ring-0 outline-none font-medium'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type='submit' className='h-14 px-8 bg-white text-slate-900 rounded-[24px] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all active:scale-95'>
                Discover
              </button>
            </div>
          </form>

          <div className='mt-12 flex flex-col items-center gap-4 opacity-60'>
            <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-white'>Trusted by Visionaries From</p>
            <div className='flex gap-8 grayscale brightness-200 invert'>
              {/* Fake Logos for "Startup Feel" */}
              <div className='font-black text-xl italic font-serif opacity-50'>Vogue</div>
              <div className='font-black text-xl font-mono opacity-50'>WIRED</div>
              <div className='font-black text-xl font-sans opacity-50'>Forbes</div>
              <div className='font-black text-xl font-serif opacity-50'>AD</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className='absolute bottom-12 left-1/2 -translate-x-1/2 text-white/30'
      >
        <div className='h-12 w-8 border-2 border-current rounded-full flex justify-center p-2'>
          <div className='h-2 w-1 bg-current rounded-full' />
        </div>
      </motion.div>
    </section>
  );
}

function ListingSection({ section, listings, loading, skeletonArray }) {
  const { title, subtitle, icon: Icon, badge, searchParam } = section;

  if (!loading && (!listings || listings.length === 0)) return null;

  return (
    <motion.div variants={ANIMATION_VARIANTS.item} className='space-y-16'>
      <div className='flex flex-col md:flex-row justify-between items-end gap-8 border-b border-indigo-500/10 pb-8'>
        <div className='space-y-6'>
          <div className='inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px]'>
            <span className='h-1 w-8 bg-indigo-600 dark:bg-indigo-400 rounded-full' /> {badge}
          </div>
          <h2 className='text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none max-w-3xl'>
            {title}
          </h2>
          <p className='text-slate-500 dark:text-slate-400 text-xl max-w-xl font-medium leading-relaxed'>
            {subtitle}
          </p>
        </div>

        <Link
          to={`/search?${searchParam}`}
          className='group flex items-center justify-center h-16 w-16 rounded-full border border-slate-200 dark:border-white/10 hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all duration-500'
        >
          <ArrowUpRight className='h-6 w-6 transition-transform group-hover:rotate-45' />
        </Link>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16'>
        {loading
          ? skeletonArray.map((_, i) => <SkeletonListing key={i} />)
          : listings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))
        }
      </div>
    </motion.div>
  );
}

function ValueProps() {
  const features = [
    { title: 'AI Valuation', desc: 'Real-time market analysis.', icon: Activity },
    { title: 'Global Access', desc: 'Properties in 120+ countries.', icon: Globe },
    { title: 'Secure Closing', desc: 'Blockchain verify deeds.', icon: ShieldCheck },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8 py-20 border-y border-slate-200 dark:border-white/5'>
      {features.map((f, i) => (
        <div key={i} className='flex items-start gap-6 group'>
          <div className='h-14 w-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500'>
            <f.icon className='h-6 w-6' />
          </div>
          <div className='space-y-2'>
            <h4 className='text-xl font-bold dark:text-white'>{f.title}</h4>
            <p className='text-slate-500 dark:text-slate-400 font-medium'>{f.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function StatsSection() {
  const stats = [
    { label: 'Total Asset Value', value: '₹140Cr', suffix: '+' },
    { label: 'Verified Listings', value: '1.2K', suffix: '+' },
    { label: 'Private Investors', value: '4.8K', suffix: '' },
  ];

  return (
    <motion.section variants={ANIMATION_VARIANTS.item} className='bg-slate-900 dark:bg-white/5 rounded-[48px] p-12 lg:p-24 relative overflow-hidden'>
      <div className='absolute inset-0 noise-bg opacity-10' />
      <div className='absolute -top-1/2 -right-1/2 w-full h-full bg-indigo-500/20 blur-[150px] rounded-full' />

      <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12'>
        {stats.map((stat, i) => (
          <div key={i} className='text-center space-y-2'>
            <div className='flex items-baseline justify-center gap-1 text-6xl lg:text-8xl font-black text-white tracking-tighter'>
              {stat.value}<span className='text-indigo-500 text-4xl'>{stat.suffix}</span>
            </div>
            <div className='text-xs font-bold uppercase tracking-[0.3em] text-slate-400'>{stat.label}</div>
          </div>
        ))}
      </div>
    </motion.section>
  );
}

function CTASection() {
  return (
    <section className='relative h-[80vh] flex items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 bg-[#020617]' />
      <div className='absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent' />

      <div className='max-w-4xl mx-auto px-6 text-center relative z-10 space-y-10'>
        <motion.h2
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className='text-6xl sm:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.8]'
        >
          Ready to <br /> <span className='text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40'>Ascend?</span>
        </motion.h2>

        <p className='text-2xl text-slate-400 font-medium max-w-xl mx-auto'>
          Join the AwasMitra collective. Access assets that never hit the public market.
        </p>

        <div className='flex flex-col sm:flex-row gap-6 justify-center pt-8'>
          <Link
            to='/search'
            className='h-16 px-10 rounded-full bg-white text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all flex items-center justify-center gap-3 active:scale-95'
          >
            Start Discovery <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className='text-center py-20'>
      <p className='text-red-400 mb-4'>{error}</p>
      <button onClick={onRetry} className='underline dark:text-white'>Try Again</button>
    </div>
  );
}