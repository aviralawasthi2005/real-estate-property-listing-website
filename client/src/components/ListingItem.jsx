import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, ArrowUpRight, Maximize2, Star, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ListingItem({ listing }) {
  // Generate a random "Match Score" for the prop-tech feel
  const matchScore = Math.floor(Math.random() * (99 - 85) + 85);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='group cursor-pointer'
    >
      <Link to={`/listing/${listing._id}`} className='block space-y-6'>
        {/* Image Container */}
        <div className='relative aspect-[4/5] overflow-hidden rounded-[24px] bg-slate-200 dark:bg-slate-800'>
          <motion.img
            src={
              listing.imageUrls[0] ||
              'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            }
            alt='listing cover'
            className='h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105'
          />

          {/* Top Badges */}
          <div className='absolute top-4 left-4 flex gap-2 z-20'>
            <div className='bg-white/90 dark:bg-[#020617]/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm'>
              <Activity className='h-3 w-3 text-emerald-500' />
              <span className='text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white'>{matchScore}% Match</span>
            </div>
          </div>

          <div className='absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0'>
            <div className='h-10 w-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center shadow-xl'>
              <ArrowUpRight className='h-4 w-4 text-indigo-600' />
            </div>
          </div>

          {/* Gradient for text legibility if needed, but keeping it clean for now */}
        </div>

        {/* Content Details */}
        <div className='space-y-3 px-1'>
          <div className='flex justify-between items-start gap-4'>
            <h3 className='text-xl font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors'>
              {listing.name}
            </h3>
            <div className='text-lg font-black text-slate-900 dark:text-white tracking-tight whitespace-nowrap'>
              ₹{listing.offer
                ? listing.discountPrice.toLocaleString('en-IN')
                : listing.regularPrice.toLocaleString('en-IN')}
            </div>
          </div>

          <p className='text-sm text-slate-500 dark:text-slate-400 font-medium truncate'>
            {listing.address}
          </p>

          <div className='flex items-center gap-4 pt-2 border-t border-slate-100 dark:border-white/5'>
            <div className='flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400'>
              <Bed className='h-4 w-4 text-slate-400' /> {listing.bedrooms} Beds
            </div>
            <div className='flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400'>
              <Bath className='h-4 w-4 text-slate-400' /> {listing.bathrooms} Baths
            </div>
            <div className='flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 ml-auto'>
              <Maximize2 className='h-3 w-3 text-slate-400' /> {listing.type === 'rent' ? 'Rental' : 'Sale'}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}