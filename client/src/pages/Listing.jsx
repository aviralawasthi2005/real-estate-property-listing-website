import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  MapPin,
  Bed,
  Bath,
  ParkingCircle as Parking,
  Armchair as Furnished,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Info,
  Percent,
  Copy,
  Activity,
  CalendarCheck
} from 'lucide-react';
import Contact from '../components/Contact';
import Skeleton from '../components/Skeleton';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export default function Listing() {
  SwiperCore.use([Navigation, Pagination, Autoplay, EffectFade]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main className='bg-white dark:bg-[#020617] min-h-screen transition-colors duration-700 pt-20 overflow-hidden font-sans'>

      {/* Loading State */}
      {loading && (
        <div className='max-w-[1440px] mx-auto p-6 flex flex-col lg:flex-row gap-12 py-20'>
          <Skeleton className='h-[700px] w-full lg:w-2/3 rounded-[40px] opacity-40' />
          <div className='flex-1 space-y-8'>
            <Skeleton className='h-12 w-3/4 rounded-full opacity-40' />
            <Skeleton className='h-6 w-1/2 rounded-full opacity-40' />
            <div className='grid grid-cols-2 gap-4'>
              <Skeleton className='h-32 w-full rounded-[24px] opacity-40' />
              <Skeleton className='h-32 w-full rounded-[24px] opacity-40' />
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className='flex flex-col items-center justify-center h-[80vh] gap-8 glass-card mx-6 rounded-[40px] max-w-2xl mx-auto mt-20'>
          <div className='h-24 w-24 bg-red-500/10 rounded-full flex items-center justify-center animate-pulse'>
            <AlertCircle className='h-10 w-10 text-red-500' />
          </div>
          <div className='text-center space-y-2'>
            <h2 className='text-4xl font-black text-slate-900 dark:text-white tracking-tighter'>Acquisition Failed</h2>
            <p className='text-slate-500'>The asset data could not be retrieved securely.</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className='bg-red-500 text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-red-400 transition-all shadow-xl shadow-red-500/20 active:scale-95'
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* Main Content */}
      {listing && !loading && !error && (
        <div className='pb-40 relative animate-in fade-in duration-700'>
          {/* Background Blobs */}
          <div className='absolute top-0 right-0 w-[60%] h-[60%] bg-indigo-500/5 rounded-full blur-[160px] pointer-events-none' />
          <div className='absolute bottom-0 left-0 w-[40%] h-[40%] bg-violet-500/5 rounded-full blur-[160px] pointer-events-none' />

          <div className='max-w-[1440px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 mt-8 lg:mt-16'>

            {/* Left Column: Gallery & Description */}
            <div className='lg:col-span-8 space-y-16'>

              {/* Image Gallery */}
              <div className='relative group'>
                <Swiper
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  autoplay={{ delay: 6000 }}
                  effect='fade'
                  className='h-[500px] sm:h-[750px] rounded-[48px] overflow-hidden shadow-2xl border border-white/10'
                >
                  {listing.imageUrls.map((url) => (
                    <SwiperSlide key={url}>
                      <motion.div
                        className='h-full w-full'
                        initial={{ scale: 1.1 }}
                        whileInView={{ scale: 1 }}
                        transition={{ duration: 2.5 }}
                        style={{
                          background: `url(${url}) center no-repeat`,
                          backgroundSize: 'cover',
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                <div className='absolute top-8 right-8 z-20 flex gap-4'>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className='bg-white/10 backdrop-blur-xl p-4 rounded-2xl border border-white/20 shadow-2xl hover:bg-white hover:text-indigo-600 transition-all duration-300 group/share'
                  >
                    {copied ? <CheckCircle2 className='h-5 w-5 text-emerald-400' /> : <Share2 className='h-5 w-5 text-white' />}
                  </button>
                </div>
              </div>

              {/* Description Section */}
              <div className='space-y-12'>
                <div className='space-y-6 border-b border-indigo-500/10 pb-12'>
                  <div className='flex items-center gap-3'>
                    <div className='inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] px-4 py-2 rounded-full bg-indigo-500/5'>
                      <Activity className='h-3.5 w-3.5' /> Asset Narrative
                    </div>
                    <div className='text-xs font-medium text-slate-400 uppercase tracking-widest'>ID: {listing._id.slice(0, 8)}</div>
                  </div>
                  <h1 className='text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter'>
                    {listing.name}
                  </h1>
                  <div className='flex items-center gap-2 text-slate-500 dark:text-slate-400 text-lg'>
                    <MapPin className='h-5 w-5 text-indigo-500' />
                    <span>{listing.address}</span>
                  </div>
                </div>

                <div className='prose dark:prose-invert max-w-none'>
                  <p className='text-slate-500 dark:text-slate-400 text-xl lg:text-2xl leading-relaxed font-medium font-serif'>
                    <span className='text-6xl float-left mr-4 mt-2 font-black text-indigo-600 dark:text-indigo-400 font-sans'>
                      {listing.description.charAt(0)}
                    </span>
                    {listing.description.slice(1)}
                  </p>
                </div>

                {/* Amenities Grid */}
                <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
                  {[
                    { icon: Bed, label: `${listing.bedrooms} Beds`, sub: 'Sleeping Quarters' },
                    { icon: Bath, label: `${listing.bathrooms} Baths`, sub: 'Spa Suites' },
                    { icon: Parking, label: listing.parking ? 'Private' : 'None', sub: 'Secure Parking' },
                    { icon: Furnished, label: listing.furnished ? 'Turnkey' : 'Unfurnished', sub: 'Interior Status' }
                  ].map((item, i) => (
                    <div key={i} className='p-8 rounded-[32px] bg-slate-50 dark:bg-white/5 border border-transparent hover:border-indigo-500/20 transition-all group hover:bg-slate-100 dark:hover:bg-white/10'>
                      <item.icon className='h-8 w-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform' />
                      <div className='space-y-1'>
                        <p className='text-xl font-black dark:text-white'>{item.label}</p>
                        <p className='text-[10px] font-bold text-slate-400 uppercase tracking-widest'>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Investment Data */}
            <div className='lg:col-span-4 space-y-8'>
              <div className='sticky top-32 space-y-8'>
                <div className='glass-card p-10 rounded-[48px] border border-white/10 space-y-10 shadow-2xl relative overflow-hidden'>
                  <div className='absolute top-0 right-0 p-8 opacity-20'>
                    <Star className='h-32 w-32 text-indigo-500 rotate-12' />
                  </div>

                  {/* Price Block */}
                  <div className='space-y-4 relative z-10'>
                    <div className='text-xs font-bold text-slate-400 uppercase tracking-widest'>Asset Valuation</div>
                    <div className='flex items-baseline gap-2'>
                      <span className='text-6xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter'>
                        ₹{listing.offer ? listing.discountPrice.toLocaleString('en-IN') : listing.regularPrice.toLocaleString('en-IN')}
                      </span>
                      {listing.type === 'rent' && <span className='text-xl font-bold text-slate-400'>/mo</span>}
                    </div>

                    {listing.offer && (
                      <div className='inline-flex items-center gap-2 text-emerald-500 font-bold bg-emerald-500/10 px-4 py-2 rounded-xl text-sm'>
                        <Percent className='h-4 w-4' />
                        <span>₹{(+listing.regularPrice - +listing.discountPrice).toLocaleString('en-IN')} Below Market</span>
                      </div>
                    )}
                  </div>

                  {/* Key Stats */}
                  <div className='space-y-6 pt-6 border-t border-slate-200 dark:border-white/10'>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>Asset Class</span>
                      <span className='font-bold text-slate-900 dark:text-white uppercase tracking-wider'>{listing.type === 'rent' ? 'Leasehold' : 'Freehold'}</span>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>Verification</span>
                      <div className='flex items-center gap-1.5 text-emerald-500 font-bold text-xs uppercase tracking-wider'>
                        <ShieldCheck className='h-4 w-4' /> Verified
                      </div>
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-sm text-slate-500 dark:text-slate-400 font-medium'>Available Since</span>
                      <span className='font-bold text-slate-900 dark:text-white'>{new Date(listing.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='space-y-4 pt-4'>
                    {currentUser && listing.userRef !== currentUser._id && !contact ? (
                      <button
                        onClick={() => setContact(true)}
                        className='w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-6 rounded-3xl text-xl uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30 active:scale-95 flex items-center justify-center gap-3'
                      >
                        Initiate Inquiry <ArrowRight className='h-5 w-5' />
                      </button>
                    ) : contact ? (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <Contact listing={listing} />
                      </motion.div>
                    ) : null}
                  </div>
                </div>

                <div className='p-8 rounded-[40px] bg-slate-100 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 text-center space-y-4'>
                  <Info className='h-8 w-8 text-slate-400 mx-auto' />
                  <p className='text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mx-auto'>
                    Private viewing protocols apply. Please ensure your AwasMitra verified status is active before requesting a tour.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Noise Texture layer */}
      <div className='noise-bg z-[100]' />
    </main>
  );
}
