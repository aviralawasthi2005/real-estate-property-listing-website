import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import SkeletonListing from '../components/SkeletonListing';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Home as HomeIcon,
  Key,
  Search,
  ChevronRight,
  ShieldCheck,
  Zap,
  Star,
  Activity,
  Award,
  ArrowUpRight,
  Compass,
  MessageSquare,
  Building,
  CheckCircle2,
  Crown,
  PhoneCall
} from 'lucide-react';

const LISTING_SECTIONS = [
  {
    id: 'offers',
    title: 'Exclusive Deals & Offers',
    subtitle: 'Hand-picked luxury properties with special limited-time pricing discounts.',
    icon: Star,
    badge: 'Special Savings',
    searchParam: 'offer=true',
  },
  {
    id: 'rent',
    title: 'Featured Rental Homes',
    subtitle: 'Fully-furnished flats, modern apartments, and scenic villas available for lease.',
    icon: Key,
    badge: 'Prime Rentals',
    searchParam: 'type=rent',
  },
  {
    id: 'sale',
    title: 'Properties For Sale',
    subtitle: 'Acquire premium residential houses, penthouses, and commercial plots.',
    icon: HomeIcon,
    badge: 'Direct Ownership',
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
        fetch('/api/listing/get?offer=true&limit=4'),
        fetch('/api/listing/get?type=rent&limit=4'),
        fetch('/api/listing/get?type=sale&limit=4')
      ]);

      if (!offerRes.ok || !rentRes.ok || !saleRes.ok) {
        throw new Error('Failed to load listings');
      }

      const [offerData, rentData, saleData] = await Promise.all([
        offerRes.json(),
        rentRes.json(),
        saleRes.json()
      ]);

      setListings({ offers: offerData, rent: rentData, sale: saleData });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllListings();
  }, [fetchAllListings]);

  const skeletonArray = useMemo(() => Array(4).fill(0), []);

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-[#07090e] transition-colors duration-300 selection:bg-indigo-500/20'>
      {/* Hero Section */}
      <HeroSection listings={listings.offers} />

      {/* Main Content Sections */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-28'>
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

        {/* Feature Highlights Grid */}
        <FeaturesSection />

        {/* Premium Membership Showcase */}
        <MembershipShowcaseSection />

        {/* Real-Time Platform Stats */}
        <StatsSection />
      </div>

      {/* Call to Action Banner */}
      <CTASection />
    </div>
  );
}

function HeroSection({ listings }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'sale' | 'rent'
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  const heroImages = listings?.length > 0
    ? listings.map((l) => l.imageUrls?.[0]).filter(Boolean)
    : [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2700&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=2700&auto=format&fit=crop'
    ];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchTerm.trim()) query.set('searchTerm', searchTerm.trim());
    if (activeTab !== 'all') query.set('type', activeTab);
    navigate(`/search?${query.toString()}`);
  };

  return (
    <section className='relative min-h-[680px] lg:h-[88vh] flex items-center justify-center overflow-hidden pt-24 pb-16'>
      {/* Background Slideshow with Smooth Crossfade */}
      <AnimatePresence mode='popLayout'>
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className='absolute inset-0 z-0'
        >
          <div
            className='absolute inset-0 bg-cover bg-center'
            style={{ backgroundImage: `url(${heroImages[activeSlide] || heroImages[0]})` }}
          />
          <div className='absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-900/60 z-10' />
        </motion.div>
      </AnimatePresence>

      <div className='relative z-20 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8'>
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 text-white text-xs font-semibold'
        >
          <Sparkles className='h-3.5 w-3.5 text-indigo-400' />
          <span>Next-Gen Real Estate Marketplace</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className='text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]'
        >
          Discover Spaces Crafted For <br className='hidden sm:block' />
          <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-200 to-indigo-200'>
            Modern Living
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className='text-base sm:text-xl text-slate-200/90 max-w-2xl mx-auto font-normal leading-relaxed'
        >
          Explore thousands of verified properties, connect directly with owners in real-time, and get smart advice from our AI assistant.
        </motion.p>

        {/* Interactive Search Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className='max-w-2xl mx-auto pt-2'
        >
          <div className='bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl rounded-3xl p-3 shadow-2xl border border-white/20 dark:border-slate-800 space-y-3'>
            {/* Search Type Tabs */}
            <div className='flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit'>
              {[
                { id: 'all', label: 'All Properties' },
                { id: 'sale', label: 'Buy' },
                { id: 'rent', label: 'Rent' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  type='button'
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? 'bg-white dark:bg-indigo-600 text-indigo-600 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Input + Action Button */}
            <form onSubmit={handleSearch} className='flex items-center gap-2'>
              <div className='relative flex-1'>
                <Search className='absolute left-4 top-3.5 h-5 w-5 text-slate-400' />
                <input
                  type='text'
                  placeholder='Search by city, neighborhood, or landmark...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className='w-full bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                />
              </div>

              <button
                type='submit'
                className='btn-primary shrink-0 px-6 py-3 text-sm rounded-2xl'
              >
                <span>Search</span>
                <ArrowRight className='h-4 w-4' />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function ListingSection({ section, listings, loading, skeletonArray }) {
  const { title, subtitle, icon: Icon, badge, searchParam } = section;

  if (!loading && (!listings || listings.length === 0)) return null;

  return (
    <div className='space-y-8'>
      {/* Section Header */}
      <div className='flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5'>
        <div className='space-y-2'>
          <div className='inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider'>
            <Icon className='h-4 w-4' />
            <span>{badge}</span>
          </div>
          <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight'>
            {title}
          </h2>
          <p className='text-sm text-slate-500 dark:text-slate-400 max-w-xl'>
            {subtitle}
          </p>
        </div>

        <Link
          to={`/search?${searchParam}`}
          className='inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group'
        >
          <span>View All</span>
          <ChevronRight className='h-4 w-4 transition-transform group-hover:translate-x-1' />
        </Link>
      </div>

      {/* Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {loading
          ? skeletonArray.map((_, i) => <SkeletonListing key={i} />)
          : listings.map((listing) => (
            <ListingItem listing={listing} key={listing._id} />
          ))
        }
      </div>
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Real-Time Direct Chat',
      desc: 'Connect with landlords and property owners in real-time with instant Socket.IO notifications.',
      icon: MessageSquare,
      color: 'from-blue-500/10 to-indigo-500/10 text-indigo-600 dark:text-indigo-400'
    },
    {
      title: 'AI Real Estate Assistant',
      desc: 'Ask our integrated Google Gemini AI assistant for guidance on neighborhoods, prices, and closing tips.',
      icon: Sparkles,
      color: 'from-purple-500/10 to-violet-500/10 text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Verified Listings Only',
      desc: 'Every home and apartment listing is backed by validated parameters, real images, and owner verification.',
      icon: ShieldCheck,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400'
    }
  ];

  return (
    <div className='space-y-10 py-12 border-t border-slate-200/80 dark:border-slate-800'>
      <div className='text-center space-y-2 max-w-xl mx-auto'>
        <span className='text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400'>
          Why Choose PrimeEstate
        </span>
        <h3 className='text-3xl font-black text-slate-900 dark:text-white tracking-tight'>
          Engineered for Simplicity & Trust
        </h3>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {features.map((feature, i) => (
          <div
            key={i}
            className='bg-white dark:bg-slate-900/80 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500/30 transition-all duration-300 space-y-4 shadow-sm'
          >
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
              <feature.icon className='h-6 w-6' />
            </div>
            <h4 className='text-xl font-bold text-slate-900 dark:text-white'>
              {feature.title}
            </h4>
            <p className='text-sm text-slate-500 dark:text-slate-400 leading-relaxed'>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MembershipShowcaseSection() {
  const perks = [
    {
      icon: Zap,
      title: 'PrimeAI Property Valuation',
      desc: 'Accurate algorithmic fair-market estimates, projected rental yields, and 5-year capital appreciation forecasts.',
      color: 'from-indigo-600 to-violet-600',
    },
    {
      icon: PhoneCall,
      title: 'Direct Verified Owner Hotline',
      desc: 'Bypass intermediary delays and extra brokerage fees. Instant phone and WhatsApp connection with actual owners.',
      color: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Crown,
      title: 'VIP 24h Early Access',
      desc: 'Spot hand-curated and price-reduced luxury listings a full 24 hours before they are released to the public market.',
      color: 'from-amber-500 to-orange-500',
    },
  ];

  return (
    <div className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-black p-8 sm:p-14 text-white border border-indigo-500/20 shadow-2xl'>
      {/* Decorative Aura */}
      <div className='absolute -top-32 -right-32 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none' />
      <div className='absolute -bottom-32 -left-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none' />

      <div className='relative z-10 max-w-4xl mx-auto space-y-10'>
        <div className='text-center space-y-4'>
          <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-white/10 text-amber-400 border border-amber-400/30 backdrop-blur-md'>
            <Crown className='h-3.5 w-3.5' /> Exclusive Member Privileges
          </div>
          <h2 className='text-3xl sm:text-5xl font-black tracking-tight leading-tight'>
            Gain an Unfair Advantage in <span className='text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-300'>Real Estate</span>
          </h2>
          <p className='text-slate-300 text-sm sm:text-base max-w-2xl mx-auto'>
            Join 15,000+ smart homebuyers, tenants, and seasoned investors who save lakhs and close deals 3x faster with PrimeEstate Membership.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {perks.map((perk, i) => (
            <div
              key={i}
              className='bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 transition-all duration-300 space-y-3'
            >
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-tr ${perk.color} flex items-center justify-center text-white shadow-lg`}>
                <perk.icon className='h-5 w-5' />
              </div>
              <h3 className='text-base font-bold text-white'>{perk.title}</h3>
              <p className='text-xs text-slate-300 leading-relaxed'>{perk.desc}</p>
            </div>
          ))}
        </div>

        <div className='pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 text-center'>
          <Link
            to='/subscription'
            className='w-full sm:w-auto px-8 py-3.5 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2'
          >
            <Sparkles className='h-4 w-4 text-indigo-600' />
            <span>Explore Plans from ₹799/mo</span>
          </Link>
          <span className='text-xs text-slate-400'>
            14-Day Money-Back Guarantee • Cancel Anytime
          </span>
        </div>
      </div>
    </div>
  );
}

function StatsSection() {
  const stats = [
    { label: 'Properties Listed', value: '2,500+' },
    { label: 'Happy Homeowners', value: '1,800+' },
    { label: 'Cities Covered', value: '25+' },
    { label: 'Response Time', value: '< 2 hrs' }
  ];

  return (
    <div className='bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl'>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-8 text-center'>
        {stats.map((stat, i) => (
          <div key={i} className='space-y-1'>
            <div className='text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-sky-200'>
              {stat.value}
            </div>
            <div className='text-xs font-semibold uppercase tracking-wider text-indigo-300/80'>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <section className='bg-slate-900 dark:bg-black py-20 px-4 text-center text-white relative overflow-hidden'>
      <div className='max-w-3xl mx-auto space-y-6 relative z-10'>
        <h2 className='text-3xl sm:text-5xl font-black tracking-tight leading-tight'>
          Have a Property to Sell or Rent?
        </h2>
        <p className='text-base sm:text-lg text-slate-300 font-normal max-w-xl mx-auto'>
          List your home on PrimeEstate in minutes, connect with verified buyers directly, and close deals faster.
        </p>
        <div className='pt-4 flex flex-wrap justify-center gap-4'>
          <Link
            to='/create-listing'
            className='bg-white text-slate-900 hover:bg-slate-100 font-bold px-8 py-3.5 rounded-2xl shadow-lg transition-all active:scale-95 inline-flex items-center gap-2 text-sm'
          >
            <span>List Your Property</span>
            <ArrowRight className='h-4 w-4' />
          </Link>
          <Link
            to='/search'
            className='bg-slate-800/80 hover:bg-slate-700 text-white font-bold px-8 py-3.5 rounded-2xl border border-slate-700 transition-all text-sm'
          >
            Browse Catalog
          </Link>
        </div>
      </div>
    </section>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className='text-center py-12 space-y-3 bg-red-50 dark:bg-red-950/20 rounded-2xl p-6 border border-red-200 dark:border-red-900/40'>
      <p className='text-sm font-semibold text-red-600 dark:text-red-400'>{error}</p>
      <button onClick={onRetry} className='btn-secondary text-xs px-4 py-2'>
        Try Again
      </button>
    </div>
  );
}