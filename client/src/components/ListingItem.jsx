import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, ArrowUpRight, Sparkles, Car, Armchair, Crown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSubscription } from '../hooks/useSubscription';

export default function ListingItem({ listing }) {
  const { isSubscriber } = useSubscription();
  const isRent = listing.type === 'rent';
  const hasOffer = listing.offer && listing.discountPrice > 0;
  const currentPrice = hasOffer ? listing.discountPrice : listing.regularPrice;
  const savings = hasOffer ? Number(listing.regularPrice) - Number(listing.discountPrice) : 0;
  const isVipListing = currentPrice >= 2500000 || listing.offer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='group'
    >
      <Link
        to={`/listing/${listing._id}`}
        className='block bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300'
      >
        {/* Image Container */}
        <div className='relative aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-slate-800'>
          <img
            src={
              listing.imageUrls?.[0] ||
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
            alt={listing.name}
            loading='lazy'
            className='h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105'
          />

          {/* Type Badge & Offer Pill */}
          <div className='absolute top-3 left-3 flex flex-wrap gap-1.5 z-10'>
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              isRent 
                ? 'bg-sky-500/90 text-white' 
                : 'bg-indigo-600/90 text-white'
            }`}>
              {isRent ? 'For Rent' : 'For Sale'}
            </span>

            {hasOffer && (
              <span className='px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/90 text-white backdrop-blur-md shadow-sm flex items-center gap-1'>
                <Sparkles className='h-3 w-3' /> Save ₹{savings.toLocaleString('en-IN')}
              </span>
            )}

            {isVipListing && (
              <span className='px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-orange-500 text-white backdrop-blur-md shadow-sm flex items-center gap-1'>
                <Crown className='h-3 w-3' /> VIP
              </span>
            )}
          </div>

          {/* Top Right: Subscriber Intel or Quick View */}
          <div className='absolute top-3 right-3 z-10 flex items-center gap-1.5'>
            {isSubscriber && (
              <span className='px-2 py-0.5 rounded-full text-[10px] font-black tracking-wide bg-slate-900/85 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shadow-md'>
                <Zap className='h-3 w-3' /> {listing.type === 'rent' ? '8.9% Yield' : 'High ROI'}
              </span>
            )}
            <div className='h-8 w-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
              <ArrowUpRight className='h-4 w-4' />
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className='p-5 space-y-3'>
          {/* Price Header */}
          <div className='flex items-baseline justify-between gap-2'>
            <div className='flex items-baseline gap-1'>
              <span className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>
                ₹{Number(currentPrice).toLocaleString('en-IN')}
              </span>
              {isRent && (
                <span className='text-xs font-semibold text-slate-500 dark:text-slate-400'>
                  / month
                </span>
              )}
            </div>

            {hasOffer && (
              <span className='text-xs text-slate-400 line-through'>
                ₹{Number(listing.regularPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className='text-base font-bold text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
            {listing.name}
          </h3>

          {/* Location */}
          <div className='flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400'>
            <MapPin className='h-3.5 w-3.5 text-slate-400 shrink-0' />
            <span className='truncate'>{listing.address}</span>
          </div>

          {/* Amenities Footer */}
          <div className='flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs font-semibold text-slate-600 dark:text-slate-400'>
            <div className='flex items-center gap-1'>
              <Bed className='h-3.5 w-3.5 text-indigo-500' />
              <span>{listing.bedrooms} {listing.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className='flex items-center gap-1'>
              <Bath className='h-3.5 w-3.5 text-indigo-500' />
              <span>{listing.bathrooms} {listing.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            {listing.parking && (
              <div className='flex items-center gap-1'>
                <Car className='h-3.5 w-3.5 text-indigo-500' />
                <span>Parking</span>
              </div>
            )}
            {listing.furnished && (
              <div className='flex items-center gap-1'>
                <Armchair className='h-3.5 w-3.5 text-indigo-500' />
                <span>Furnished</span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}