import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import SkeletonListing from '../components/SkeletonListing';
import { Search as SearchIcon, Filter, SortAsc, ChevronDown, Check, SlidersHorizontal } from 'lucide-react';
import { cn } from '../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';

export default function Search() {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
      setListings(data);
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === 'all' ||
      e.target.id === 'rent' ||
      e.target.id === 'sale'
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebardata.searchTerm);
    urlParams.set('type', sidebardata.type);
    urlParams.set('parking', sidebardata.parking);
    urlParams.set('furnished', sidebardata.furnished);
    urlParams.set('offer', sidebardata.offer);
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className='flex flex-col md:flex-row bg-white dark:bg-[#020617] min-h-screen transition-colors duration-700 pt-20'>
      {/* Sidebar Filters */}
      <div className='p-8 md:p-10 border-r border-slate-200/50 dark:border-white/5 md:min-h-screen w-full md:w-80 lg:w-[400px] bg-slate-50/50 dark:bg-white/[0.02] backdrop-blur-3xl relative z-10'>
        <div className='flex items-center gap-3 mb-10'>
          <div className='h-10 w-10 bg-indigo-600/10 rounded-xl flex items-center justify-center'>
            <SlidersHorizontal className='h-5 w-5 text-indigo-600' />
          </div>
          <h2 className='text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter'>Filters</h2>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-10'>
          <div className='space-y-4'>
            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>
              Asset Search
            </label>
            <div className='relative group'>
              <input
                type='text'
                id='searchTerm'
                placeholder='Search global locales...'
                className='w-full glass-card border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white placeholder:text-slate-400 outline-none transition-all'
                value={sidebardata.searchTerm}
                onChange={handleChange}
              />
              <SearchIcon className='absolute left-4 top-4.5 h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors' />
            </div>
          </div>

          <div className='space-y-6'>
            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>Transaction Type</label>
            <div className='grid grid-cols-1 gap-3'>
              {['all', 'rent', 'sale'].map((t) => (
                <label key={t} className='flex items-center gap-4 cursor-pointer group p-4 glass-card rounded-2xl border border-transparent hover:border-indigo-500/20 transition-all'>
                  <div className='relative flex items-center shrink-0'>
                    <input
                      type='checkbox'
                      id={t}
                      className='peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 dark:border-slate-700 transition-all checked:bg-indigo-600 checked:border-indigo-600'
                      onChange={handleChange}
                      checked={sidebardata.type === t}
                    />
                    <Check className='absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 ml-1' />
                  </div>
                  <span className='capitalize text-slate-600 dark:text-slate-400 font-bold group-hover:text-indigo-600 transition-colors'>
                    {t === 'all' ? 'Universal Access' : t}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-6'>
            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>Amenities & Elite Features</label>
            <div className='grid grid-cols-1 gap-3'>
              {['offer', 'parking', 'furnished'].map((id) => (
                <label key={id} className='flex items-center gap-3 cursor-pointer group pl-1'>
                  <div className='relative flex items-center shrink-0'>
                    <input
                      type='checkbox'
                      id={id}
                      className='peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-200 dark:border-slate-800 transition-all checked:bg-indigo-600 checked:border-indigo-600'
                      onChange={handleChange}
                      checked={sidebardata[id]}
                    />
                    <Check className='absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 ml-1' />
                  </div>
                  <span className='capitalize text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight capitalize'>{id}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='space-y-4'>
            <label className='text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1'>Priority Index</label>
            <div className='relative'>
              <select
                onChange={handleChange}
                defaultValue={'created_at_desc'}
                id='sort_order'
                className='w-full glass-card border-none rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-indigo-500/20 text-slate-800 dark:text-white outline-none appearance-none font-bold'
              >
                <option value='regularPrice_desc'>Price Index (High to Low)</option>
                <option value='regularPrice_asc'>Price Index (Low to High)</option>
                <option value='createdAt_desc'>Acquisition Date (Newest)</option>
                <option value='createdAt_asc'>Acquisition Date (Oldest)</option>
              </select>
              <ChevronDown className='absolute right-4 top-4.5 h-5 w-5 text-slate-400 pointer-events-none' />
            </div>
          </div>

          <button className='w-full bg-indigo-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] mt-4'>
            Apply Filter Protocol
          </button>
        </form>
      </div>

      {/* Main Content Area */}
      <div className='flex-1 p-6 md:p-12 relative overflow-hidden'>
        {/* Background Blobs */}
        <div className='absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none' />

        <div className='relative z-10'>
          <div className='pb-10 mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/5'>
            <div className='space-y-4'>
              <div className='inline-flex items-center gap-2 text-indigo-500 font-bold uppercase tracking-[0.2em] text-[10px] px-3 py-1 rounded-full bg-indigo-500/10'>
                Search Results
              </div>
              <h1 className='text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none'>
                Discovery Portal.
              </h1>
            </div>
            <div className='flex items-center gap-3 glass-card px-6 py-3 rounded-2xl'>
              <div className='h-2 w-2 rounded-full bg-indigo-500 animate-pulse' />
              <p className='text-slate-500 dark:text-slate-400 font-black text-sm uppercase tracking-widest'>
                {listings.length} High-Value Assets found
              </p>
            </div>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10'>
            {!loading && listings.length === 0 && (
              <div className='col-span-full py-32 text-center w-full space-y-6 glass-card rounded-[40px]'>
                <p className='text-3xl text-slate-400 font-black tracking-tighter'>No assets match your current parameters.</p>
                <button
                  onClick={() => setSidebardata({ searchTerm: '', type: 'all', parking: false, furnished: false, offer: false, sort: 'created_at', order: 'desc' })}
                  className='text-indigo-600 font-black uppercase tracking-widest text-sm hover:underline'
                >
                  Reset Discovery Protocol
                </button>
              </div>
            )}

            {loading ? (
              Array(6).fill(0).map((_, i) => <SkeletonListing key={i} />)
            ) : (
              listings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))
            )}
          </div>

          {showMore && (
            <div className='flex justify-center mt-20 mb-10'>
              <button
                onClick={onShowMoreClick}
                className='glass-card px-12 py-5 rounded-full font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all duration-500 shadow-xl'
              >
                Reveal more assets
              </button>
            </div>
          )}
        </div>

        {/* Noise Layer */}
        <div className='noise-bg' />
      </div>
    </div>
  );
}
