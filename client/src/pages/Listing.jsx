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
  UserCheck
} from 'lucide-react';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';
import Skeleton from '../components/Skeleton';

export default function Listing() {
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
    </main>
  );
}
