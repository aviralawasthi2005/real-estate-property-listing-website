import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ListingItem from '../components/ListingItem';
import SkeletonListing from '../components/SkeletonListing';
import { Search as SearchIcon, SlidersHorizontal, RotateCcw, ArrowUpDown, ChevronDown, Check, Sparkles, Crown, Zap } from 'lucide-react';
import { useSubscription } from '../hooks/useSubscription';

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isSubscriber, tier } = useSubscription();

  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'createdAt',
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

    setSidebardata({
      searchTerm: searchTermFromUrl || '',
      type: typeFromUrl || 'all',
      parking: parkingFromUrl === 'true',
      furnished: furnishedFromUrl === 'true',
      offer: offerFromUrl === 'true',
      sort: sortFromUrl || 'createdAt',
      order: orderFromUrl || 'desc',
    });

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setShowMore(data.length >= 9);
          setListings(data);
        } else {
          setListings([]);
        }
      } catch (err) {
        console.error('Failed to load listings', err);
        setListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === 'all' || id === 'rent' || id === 'sale') {
      setSidebardata((prev) => ({ ...prev, type: id }));
    }

    if (id === 'searchTerm') {
      setSidebardata((prev) => ({ ...prev, searchTerm: value }));
    }

    if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setSidebardata((prev) => ({ ...prev, [id]: checked }));
    }

    if (id === 'sort_order') {
      const [sort, order] = value.split('_');
      setSidebardata((prev) => ({ ...prev, sort: sort || 'createdAt', order: order || 'desc' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (sidebardata.searchTerm) urlParams.set('searchTerm', sidebardata.searchTerm);
    if (sidebardata.type && sidebardata.type !== 'all') urlParams.set('type', sidebardata.type);
    if (sidebardata.parking) urlParams.set('parking', 'true');
    if (sidebardata.furnished) urlParams.set('furnished', 'true');
    if (sidebardata.offer) urlParams.set('offer', 'true');
    urlParams.set('sort', sidebardata.sort);
    urlParams.set('order', sidebardata.order);
    navigate(`/search?${urlParams.toString()}`);
  };

  const handleReset = () => {
    setSidebardata({
      searchTerm: '',
      type: 'all',
      parking: false,
      furnished: false,
      offer: false,
      sort: 'createdAt',
      order: 'desc',
    });
    navigate('/search');
  };

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    try {
      const res = await fetch(`/api/listing/get?${urlParams.toString()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        if (data.length < 9) setShowMore(false);
        setListings((prev) => [...prev, ...data]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50 dark:bg-[#07090e] pt-24 pb-20'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Sidebar Filter Panel */}
          <div className='w-full lg:w-80 shrink-0'>
            <div className='bg-white dark:bg-slate-900/90 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm sticky top-28 space-y-6'>
              <div className='flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800'>
                <div className='flex items-center gap-2'>
                  <SlidersHorizontal className='h-5 w-5 text-indigo-600' />
                  <h2 className='text-lg font-bold text-slate-900 dark:text-white'>Filters</h2>
                </div>
                <button
                  type='button'
                  onClick={handleReset}
                  className='text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors'
                >
                  <RotateCcw className='h-3.5 w-3.5' /> Reset
                </button>
              </div>

              <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Search Term */}
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                    Search Keywords
                  </label>
                  <div className='relative'>
                    <input
                      type='text'
                      id='searchTerm'
                      placeholder='Locality, landmark, title...'
                      value={sidebardata.searchTerm}
                      onChange={handleChange}
                      className='input-field text-sm pl-10'
                    />
                    <SearchIcon className='absolute left-3.5 top-3.5 h-4 w-4 text-slate-400' />
                  </div>
                </div>

                {/* Property Transaction Type */}
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                    Listing Type
                  </label>
                  <div className='grid grid-cols-3 gap-2'>
                    {[
                      { id: 'all', label: 'All' },
                      { id: 'sale', label: 'Buy' },
                      { id: 'rent', label: 'Rent' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        type='button'
                        id={type.id}
                        onClick={handleChange}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                          sidebardata.type === type.id
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities & Attributes */}
                <div className='space-y-3'>
                  <label className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                    Preferences
                  </label>
                  <div className='space-y-2'>
                    {[
                      { id: 'offer', label: 'Special Discount Offer' },
                      { id: 'parking', label: 'Dedicated Parking Space' },
                      { id: 'furnished', label: 'Fully Furnished' }
                    ].map((item) => (
                      <label
                        key={item.id}
                        className='flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer transition-colors'
                      >
                        <input
                          type='checkbox'
                          id={item.id}
                          checked={sidebardata[item.id]}
                          onChange={handleChange}
                          className='h-4 w-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 dark:border-slate-700'
                        />
                        <span className='text-xs font-semibold text-slate-700 dark:text-slate-300'>
                          {item.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sort Order */}
                <div className='space-y-2'>
                  <label className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                    Sort By
                  </label>
                  <div className='relative'>
                    <select
                      id='sort_order'
                      value={`${sidebardata.sort}_${sidebardata.order}`}
                      onChange={handleChange}
                      className='input-field text-xs font-semibold appearance-none pr-9'
                    >
                      <option value='createdAt_desc'>Newest Additions</option>
                      <option value='regularPrice_asc'>Price: Low to High</option>
                      <option value='regularPrice_desc'>Price: High to Low</option>
                      <option value='createdAt_asc'>Oldest First</option>
                    </select>
                    <ChevronDown className='absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none' />
                  </div>
                </div>

                {/* Apply Button */}
                <button type='submit' className='btn-primary w-full text-xs py-3'>
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Results Area */}
          <div className='flex-1 space-y-6'>
            {/* Header / Counter */}
            <div className='flex items-center justify-between bg-white dark:bg-slate-900/90 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm'>
              <div className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-emerald-500' />
                <h1 className='text-lg font-bold text-slate-900 dark:text-white'>
                  {loading ? 'Searching properties...' : `${listings.length} Properties Available`}
                </h1>
              </div>

              {sidebardata.searchTerm && (
                <div className='text-xs text-slate-500 dark:text-slate-400 font-medium'>
                  Matching &ldquo;<span className='font-bold text-indigo-600 dark:text-indigo-400'>{sidebardata.searchTerm}</span>&rdquo;
                </div>
              )}
            </div>

            {/* Subscriber intelligence / Upgrade banner */}
            {isSubscriber ? (
              <div className='p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 flex items-center justify-between text-xs font-semibold'>
                <div className='flex items-center gap-2 text-indigo-700 dark:text-indigo-300'>
                  {tier === 'elite' ? <Crown className='h-4 w-4 text-amber-500' /> : <Zap className='h-4 w-4 text-indigo-500' />}
                  <span>{tier === 'elite' ? 'Elite VIP Privilege' : 'Pro Member Status'}: Showing AI valuation metrics & direct verified owner contacts.</span>
                </div>
                <span className='px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase'>
                  Active
                </span>
              </div>
            ) : (
              <div className='p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-amber-500/10 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs'>
                <div className='flex items-center gap-2.5 text-slate-700 dark:text-slate-300'>
                  <div className='p-2 rounded-xl bg-indigo-600 text-white shadow-sm'>
                    <Sparkles className='h-4 w-4' />
                  </div>
                  <div>
                    <span className='font-bold text-slate-900 dark:text-white block'>Want 24h Early Access to fresh listings & direct owner numbers?</span>
                    <span className='text-slate-500 text-[11px]'>Join 15,000+ smart homebuyers and investors with PrimeEstate Pro.</span>
                  </div>
                </div>
                <Link
                  to='/subscription'
                  className='px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shrink-0 self-start sm:self-center transition-colors shadow-sm'
                >
                  Upgrade to Pro →
                </Link>
              </div>
            )}

            {/* Listings Grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
              {loading ? (
                Array(6).fill(0).map((_, i) => <SkeletonListing key={i} />)
              ) : listings.length === 0 ? (
                <div className='col-span-full py-20 text-center bg-white dark:bg-slate-900/90 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 space-y-4 shadow-sm'>
                  <div className='h-16 w-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400'>
                    <SearchIcon className='h-8 w-8' />
                  </div>
                  <h3 className='text-xl font-bold text-slate-800 dark:text-slate-200'>
                    No matching properties found
                  </h3>
                  <p className='text-sm text-slate-500 max-w-sm mx-auto'>
                    Try loosening your filter parameters or search for a broader city or locality.
                  </p>
                  <button onClick={handleReset} className='btn-secondary text-xs px-5 py-2.5'>
                    Reset All Filters
                  </button>
                </div>
              ) : (
                listings.map((listing) => (
                  <ListingItem key={listing._id} listing={listing} />
                ))
              )}
            </div>

            {/* Load More Button */}
            {showMore && (
              <div className='flex justify-center pt-8'>
                <button
                  onClick={onShowMoreClick}
                  className='btn-secondary text-xs px-8 py-3 rounded-full hover:border-indigo-500 text-indigo-600 dark:text-indigo-400 font-bold'
                >
                  Load More Properties
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
