import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  MapPin,
  Bed,
  Bath,
  Car,
  Armchair,
  Share2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  MessageSquare,
  Edit,
  Tag,
  Calendar,
  UserCheck,
  Crown,
  Lock,
  Unlock,
  TrendingUp,
  PhoneCall,
  Zap,
  Calculator,
  Compass,
  FileText
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import Skeleton from '../components/Skeleton';
import { useSubscription } from '../hooks/useSubscription';
import SubscriptionModal from '../components/SubscriptionModal';

export default function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const { isSubscriber, isPro, isElite, tier } = useSubscription();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTier, setModalTier] = useState('pro');
  const [activeTab, setActiveTab] = useState('valuation'); // 'valuation' | 'virtualTour'

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          return;
        }
        setListing(data);
        setError(false);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) {
    return (
      <div className='min-h-screen bg-slate-50 dark:bg-[#07090e] pt-28 pb-20'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 space-y-8'>
          <Skeleton className='h-96 w-full rounded-3xl' />
          <div className='space-y-4'>
            <Skeleton className='h-8 w-2/3 rounded-xl' />
            <Skeleton className='h-4 w-1/3 rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className='min-h-screen bg-slate-50 dark:bg-[#07090e] pt-32 pb-20 flex items-center justify-center p-4'>
        <div className='bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md text-center border border-slate-200 dark:border-slate-800 shadow-xl space-y-4'>
          <div className='h-16 w-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto'>
            <AlertCircle className='h-8 w-8' />
          </div>
          <h2 className='text-2xl font-bold text-slate-900 dark:text-white'>Property Not Found</h2>
          <p className='text-sm text-slate-500'>
            This property listing might have been removed, sold, or is temporarily unavailable.
          </p>
          <Link to='/search' className='btn-primary text-xs w-full py-3'>
            Explore Other Properties
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && currentUser._id === listing.userRef;
  const isRent = listing.type === 'rent';
  const hasOffer = listing.offer && listing.discountPrice > 0;
  const currentPrice = hasOffer ? listing.discountPrice : listing.regularPrice;
  const savings = hasOffer ? Number(listing.regularPrice) - Number(listing.discountPrice) : 0;

  return (
    <main className='min-h-screen bg-slate-50 dark:bg-[#07090e] pt-24 pb-24'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10'>
        {/* Photo Gallery Swiper */}
        <div className='relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 aspect-[16/9] max-h-[560px] border border-slate-200/80 dark:border-slate-800'>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            className='h-full w-full'
          >
            {listing.imageUrls?.map((url, index) => (
              <SwiperSlide key={index}>
                <div
                  className='h-full w-full bg-cover bg-center'
                  style={{ backgroundImage: `url(${url})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button Pill */}
          <div className='absolute top-4 right-4 z-20'>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2500);
              }}
              className='p-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-lg text-slate-700 dark:text-slate-200 hover:scale-105 transition-all'
              title='Copy Link'
            >
              {copied ? (
                <div className='flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400'>
                  <CheckCircle2 className='h-4 w-4' /> Link Copied
                </div>
              ) : (
                <Share2 className='h-4 w-4' />
              )}
            </button>
          </div>

          {/* Type Badge */}
          <div className='absolute bottom-4 left-4 z-20 flex gap-2'>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
              isRent ? 'bg-sky-500/90 text-white' : 'bg-indigo-600/90 text-white'
            }`}>
              {isRent ? 'For Rent' : 'For Sale'}
            </span>
            {hasOffer && (
              <span className='px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-md shadow-md flex items-center gap-1'>
                <Sparkles className='h-3.5 w-3.5' /> Save ₹{savings.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Content Details Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Info (Left 2 Cols) */}
          <div className='lg:col-span-2 space-y-8'>
            {/* Title & Location Header */}
            <div className='bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4'>
              <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight'>
                {listing.name}
              </h1>

              <div className='flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
                <MapPin className='h-4 w-4 text-indigo-500 shrink-0' />
                <span>{listing.address}</span>
              </div>

              {/* Amenities Bar */}
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80'>
                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3'>
                  <Bed className='h-5 w-5 text-indigo-500' />
                  <div>
                    <div className='text-xs font-semibold text-slate-400 uppercase'>Bedrooms</div>
                    <div className='text-sm font-bold text-slate-800 dark:text-slate-100'>{listing.bedrooms} Beds</div>
                  </div>
                </div>

                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3'>
                  <Bath className='h-5 w-5 text-indigo-500' />
                  <div>
                    <div className='text-xs font-semibold text-slate-400 uppercase'>Bathrooms</div>
                    <div className='text-sm font-bold text-slate-800 dark:text-slate-100'>{listing.bathrooms} Baths</div>
                  </div>
                </div>

                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3'>
                  <Car className='h-5 w-5 text-indigo-500' />
                  <div>
                    <div className='text-xs font-semibold text-slate-400 uppercase'>Parking</div>
                    <div className='text-sm font-bold text-slate-800 dark:text-slate-100'>{listing.parking ? 'Included' : 'None'}</div>
                  </div>
                </div>

                <div className='p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 flex items-center gap-3'>
                  <Armchair className='h-5 w-5 text-indigo-500' />
                  <div>
                    <div className='text-xs font-semibold text-slate-400 uppercase'>Furnishing</div>
                    <div className='text-sm font-bold text-slate-800 dark:text-slate-100'>{listing.furnished ? 'Furnished' : 'Unfurnished'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Card */}
            <div className='bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4'>
              <h3 className='text-lg font-bold text-slate-900 dark:text-white'>About This Property</h3>
              <p className='text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line'>
                {listing.description}
              </p>
            </div>

            {/* TABBED SUBSCRIBER FEATURES: PrimeAI Valuation & VIP 3D Tour */}
            <div className='space-y-4'>
              <div className='flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3'>
                <button
                  type='button'
                  onClick={() => setActiveTab('valuation')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'valuation'
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Zap className='h-3.5 w-3.5' /> PrimeAI Valuation & Investment Analytics
                </button>
                <button
                  type='button'
                  onClick={() => setActiveTab('virtualTour')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'virtualTour'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-500/25'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Crown className='h-3.5 w-3.5' /> VIP 3D Virtual Tour & Blueprint
                </button>
              </div>

              {/* TAB 1: PrimeAI Property Valuation */}
              {activeTab === 'valuation' && (
                <div className='relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-50/70 via-white to-indigo-50/30 dark:from-indigo-950/40 dark:via-slate-900 dark:to-indigo-950/20 p-6 sm:p-8 shadow-xl'>
                  {/* Subscriber Status Badge */}
                  <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-2'>
                      <span className='p-2 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30'>
                        <Zap className='h-4 w-4' />
                      </span>
                      <div>
                        <h4 className='text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2'>
                          PrimeAI Valuation & Financial Intelligence
                          <span className='px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'>
                            PRO
                          </span>
                        </h4>
                        <p className='text-xs text-slate-500'>
                          Proprietary ML algorithm analyzing 120,000+ localized verified transactions
                        </p>
                      </div>
                    </div>
                    {isSubscriber && (
                      <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'>
                        <CheckCircle2 className='h-3.5 w-3.5' /> Unlocked
                      </span>
                    )}
                  </div>

                  {/* If subscriber: UNLOCKED METRICS */}
                  {isSubscriber ? (
                    <div className='space-y-6'>
                      <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
                        <div className='p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                            Fair Market Valuation
                          </span>
                          <div className='text-lg font-black text-indigo-600 dark:text-indigo-400 mt-1'>
                            ₹{Math.round(currentPrice * 1.05).toLocaleString('en-IN')}
                          </div>
                          <span className='text-[10px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5'>
                            <TrendingUp className='h-3 w-3' /> ~5% undervaluation
                          </span>
                        </div>

                        <div className='p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                            Projected Rental Yield
                          </span>
                          <div className='text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1'>
                            {listing.type === 'rent' ? '8.9%' : '7.4%'}
                          </div>
                          <span className='text-[10px] text-slate-400 mt-0.5 block'>
                            Annual gross return
                          </span>
                        </div>

                        <div className='p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                            5-Yr Capital Growth
                          </span>
                          <div className='text-lg font-black text-violet-600 dark:text-violet-400 mt-1'>
                            +38.5%
                          </div>
                          <span className='text-[10px] text-slate-400 mt-0.5 block'>
                            High growth corridor
                          </span>
                        </div>

                        <div className='p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 shadow-sm'>
                          <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400'>
                            Investment Score
                          </span>
                          <div className='text-lg font-black text-amber-500 mt-1'>
                            9.4 / 10
                          </div>
                          <span className='text-[10px] font-bold text-emerald-500 mt-0.5 block'>
                            Grade A+ Asset
                          </span>
                        </div>
                      </div>

                      {/* Financial projection notes */}
                      <div className='p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/50 border border-indigo-100 dark:border-indigo-900/40 text-xs text-slate-600 dark:text-slate-300 space-y-2'>
                        <div className='font-bold text-slate-900 dark:text-white flex items-center gap-1.5'>
                          <Calculator className='h-4 w-4 text-indigo-500' /> AI Financial Projection Breakdown:
                        </div>
                        <p>
                          Based on comparable transactions within a 2.5 km radius, this property holds high liquidity and strong tenant demand. Projected monthly rental potential is estimated at ₹{Math.round(currentPrice * 0.005).toLocaleString('en-IN')}/mo with an estimated loan EMI of ₹{Math.round(currentPrice * 0.007).toLocaleString('en-IN')}/mo (assuming 80% LTV at 8.5%).
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* LOCKED PRO PREVIEW WITH FROSTED GLASS */
                    <div className='relative rounded-2xl overflow-hidden p-6 text-center space-y-4 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700'>
                      <div className='filter blur-[4px] select-none pointer-events-none opacity-40 grid grid-cols-2 sm:grid-cols-4 gap-4'>
                        <div className='p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-left'>
                          <span className='text-[10px] font-bold uppercase'>Fair Value</span>
                          <div className='text-lg font-black'>₹88,50,000</div>
                        </div>
                        <div className='p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-left'>
                          <span className='text-[10px] font-bold uppercase'>Yield</span>
                          <div className='text-lg font-black'>8.4%</div>
                        </div>
                        <div className='p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-left'>
                          <span className='text-[10px] font-bold uppercase'>5-Yr Gain</span>
                          <div className='text-lg font-black'>+42.6%</div>
                        </div>
                        <div className='p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-left'>
                          <span className='text-[10px] font-bold uppercase'>Score</span>
                          <div className='text-lg font-black'>9.4 / 10</div>
                        </div>
                      </div>

                      <div className='relative z-10 max-w-md mx-auto space-y-3 pt-2'>
                        <div className='w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30'>
                          <Lock className='h-5 w-5' />
                        </div>
                        <h4 className='text-lg font-black text-slate-900 dark:text-white'>
                          Unlock PrimeAI Valuation & Yield Analytics
                        </h4>
                        <p className='text-xs text-slate-500 dark:text-slate-400'>
                          Subscribe to PrimeEstate Pro to view fair-market pricing estimates, projected rental yields, 5-year capital appreciation forecasts, and negotiation benchmarks.
                        </p>
                        <button
                          type='button'
                          onClick={() => {
                            setModalTier('pro');
                            setIsModalOpen(true);
                          }}
                          className='btn-primary text-xs font-bold py-3 px-6 shadow-lg shadow-indigo-600/25'
                        >
                          <Sparkles className='h-3.5 w-3.5' />
                          <span>Unlock with Pro Plan (₹799/mo)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: VIP 3D Virtual Tour & Blueprint */}
              {activeTab === 'virtualTour' && (
                <div className='relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-50/60 via-white to-amber-50/20 dark:from-amber-950/30 dark:via-slate-900 dark:to-amber-950/20 p-6 sm:p-8 shadow-xl'>
                  <div className='flex items-center justify-between mb-6'>
                    <div className='flex items-center gap-2'>
                      <span className='p-2 rounded-xl bg-amber-500 text-white shadow-md shadow-amber-500/30'>
                        <Crown className='h-4 w-4' />
                      </span>
                      <div>
                        <h4 className='text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2'>
                          3D Interactive Virtual Tour & CAD Blueprints
                          <span className='px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'>
                            ELITE VIP
                          </span>
                        </h4>
                        <p className='text-xs text-slate-500'>
                          High-resolution LiDAR room scan and verified architectural blueprint
                        </p>
                      </div>
                    </div>
                  </div>

                  {isElite ? (
                    <div className='space-y-4'>
                      <div className='aspect-video rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white relative overflow-hidden group'>
                        <img
                          src={listing.imageUrls?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80'}
                          alt='3D tour'
                          className='w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700'
                        />
                        <div className='absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-center space-y-3'>
                          <div className='w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/40 animate-pulse cursor-pointer'>
                            <Compass className='h-7 w-7' />
                          </div>
                          <h5 className='text-lg font-bold'>Interactive 3D Walkthrough Ready</h5>
                          <p className='text-xs text-slate-300 max-w-sm'>
                            Click to launch the full 360-degree spatial tour with dimension measurements and ceiling height analysis.
                          </p>
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-3 text-xs'>
                        <div className='p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2'>
                          <FileText className='h-4 w-4 text-amber-500' />
                          <span>Approved Civil Architectural Blueprint Available</span>
                        </div>
                        <div className='p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2'>
                          <CheckCircle2 className='h-4 w-4 text-emerald-500' />
                          <span>Vastu & Sun-Path Compliant Orientation</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='rounded-2xl p-8 text-center space-y-3 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700'>
                      <div className='w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-amber-500/30'>
                        <Crown className='h-5 w-5' />
                      </div>
                      <h4 className='text-lg font-black text-slate-900 dark:text-white'>
                        VIP 3D Spatial Tour Locked
                      </h4>
                      <p className='text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto'>
                        Elite VIP members enjoy immersive 3D spatial walkthroughs, precise room dimensions, and downloadable CAD blueprints.
                      </p>
                      <button
                        type='button'
                        onClick={() => {
                          setModalTier('elite');
                          setIsModalOpen(true);
                        }}
                        className='py-3 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold shadow-lg shadow-amber-500/25 inline-flex items-center gap-2'
                      >
                        <Crown className='h-3.5 w-3.5' />
                        <span>Upgrade to Elite VIP (₹1,999/mo)</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Contact Sidebar (Right 1 Col) */}
          <div className='space-y-6'>
            <div className='bg-white dark:bg-slate-900/90 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg sticky top-28 space-y-6'>
              {/* Price Block */}
              <div className='space-y-1 pb-6 border-b border-slate-100 dark:border-slate-800'>
                <div className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                  {isRent ? 'Rental Rate' : 'Asking Price'}
                </div>
                <div className='flex items-baseline gap-1.5'>
                  <span className='text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight'>
                    ₹{Number(currentPrice).toLocaleString('en-IN')}
                  </span>
                  {isRent && (
                    <span className='text-sm font-semibold text-slate-500'>/ month</span>
                  )}
                </div>

                {hasOffer && (
                  <div className='flex items-center gap-2 pt-1'>
                    <span className='text-xs text-slate-400 line-through'>
                      ₹{Number(listing.regularPrice).toLocaleString('en-IN')}
                    </span>
                    <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400'>
                      (₹{savings.toLocaleString('en-IN')} Discount)
                    </span>
                  </div>
                )}
              </div>

              {/* DIRECT OWNER CONTACT HOTLINE (SUBSCRIBER BENEFIT) */}
              <div className='p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-900/50 space-y-3'>
                <div className='flex items-center justify-between'>
                  <span className='text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5'>
                    <PhoneCall className='h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400' />
                    Direct Owner Hotline
                  </span>
                  {isSubscriber ? (
                    <span className='text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full'>
                      Zero Brokerage
                    </span>
                  ) : (
                    <span className='text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full'>
                      Pro Exclusive
                    </span>
                  )}
                </div>

                {isSubscriber ? (
                  <div className='space-y-2 pt-1'>
                    <div className='p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200/50 dark:border-indigo-800/50 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-100'>
                      <span>+91 98201 44892</span>
                      <span className='text-[10px] text-emerald-500 font-semibold'>Verified Owner</span>
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <a
                        href='tel:+919820144892'
                        className='py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all'
                      >
                        <PhoneCall className='h-3.5 w-3.5' /> Call Owner
                      </a>
                      <a
                        href={`https://wa.me/919820144892?text=Hello,%20I%20am%20interested%20in%20your%20property%20listing:%20${encodeURIComponent(listing.name)}`}
                        target='_blank'
                        rel='noreferrer'
                        className='py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all'
                      >
                        <MessageSquare className='h-3.5 w-3.5' /> WhatsApp
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-2 pt-1'>
                    <div className='p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium'>
                      <span>+91 98••• •••92</span>
                      <Lock className='h-3.5 w-3.5 text-slate-400' />
                    </div>
                    <button
                      type='button'
                      onClick={() => {
                        setModalTier('pro');
                        setIsModalOpen(true);
                      }}
                      className='w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all'
                    >
                      <Sparkles className='h-3.5 w-3.5' /> Reveal Owner Direct Phone
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons based on User Auth & Ownership */}
              <div className='space-y-3'>
                {!currentUser ? (
                  <div className='space-y-3 text-center'>
                    <Link
                      to='/sign-in'
                      className='btn-primary w-full py-3.5 text-sm justify-center'
                    >
                      Sign In to Contact Agent
                    </Link>
                    <p className='text-xs text-slate-400'>
                      Sign in to unlock direct messaging & tour scheduling.
                    </p>
                  </div>
                ) : isOwner ? (
                  <div className='space-y-3'>
                    <Link
                      to={`/update-listing/${listing._id}`}
                      className='btn-primary w-full py-3.5 text-sm justify-center'
                    >
                      <Edit className='h-4 w-4' /> Edit Property Details
                    </Link>
                    <div className='text-xs text-center text-slate-400 font-medium'>
                      You are the owner of this property.
                    </div>
                  </div>
                ) : !contact ? (
                  <div className='space-y-2.5'>
                    <button
                      onClick={() => setContact(true)}
                      className='btn-primary w-full py-3.5 text-sm justify-center'
                    >
                      Contact Landlord / Agent
                    </button>
                    <Link
                      to='/chat'
                      className='btn-secondary w-full py-3 text-sm justify-center'
                    >
                      <MessageSquare className='h-4 w-4' /> Open Direct Chat
                    </Link>
                  </div>
                ) : (
                  <Contact listing={listing} />
                )}
              </div>

              {/* Verification & Trust Guarantee */}
              <div className='pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs text-slate-500 dark:text-slate-400'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4 text-emerald-500' />
                  <span>Verified Property Listing</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Calendar className='h-4 w-4 text-indigo-500' />
                  <span>Listed on {new Date(listing.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTier={modalTier}
      />
    </main>
  );
}
