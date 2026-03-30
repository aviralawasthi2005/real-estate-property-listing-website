import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Camera, LogOut, Trash2, LayoutList, PlusCircle, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  const handleListingDelete = async (listingId) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        return;
      }
      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 py-12 flex flex-col gap-10 bg-white dark:bg-slate-900 transition-colors duration-300 min-h-screen'>
      <div className='flex flex-col md:flex-row gap-10'>
        {/* Profile Sidebar/Basic Info */}
        <div className='w-full md:w-80 flex flex-col gap-6'>
          <div className='bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-xl flex flex-col items-center text-center'>
            <div className='relative group mb-6'>
              <input
                onChange={(e) => setFile(e.target.files[0])}
                type='file'
                ref={fileRef}
                hidden
                accept='image/*'
              />
              <img
                onClick={() => fileRef.current.click()}
                src={formData.avatar || currentUser.avatar}
                alt='profile'
                className='rounded-3xl h-32 w-32 object-cover cursor-pointer hover:opacity-80 transition-opacity ring-4 ring-blue-500/20'
              />
              <div
                onClick={() => fileRef.current.click()}
                className='absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl cursor-pointer shadow-lg hover:scale-110 transition-transform'
              >
                <Camera className='h-5 w-5' />
              </div>
            </div>

            <h2 className='text-xl font-bold text-slate-800 dark:text-slate-100 mb-1'>{currentUser.username}</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400 mb-6'>{currentUser.email}</p>

            <div className='w-full space-y-3'>
              {fileUploadError ? (
                <div className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-2 rounded-lg text-xs font-medium flex items-center gap-2 justify-center'>
                  <AlertCircle className='h-4 w-4' /> Error uploading image
                </div>
              ) : filePerc > 0 && filePerc < 100 ? (
                <div className='w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden'>
                  <div className='bg-blue-600 h-full transition-all' style={{ width: `${filePerc}%` }} />
                </div>
              ) : filePerc === 100 ? (
                <div className='bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-2 rounded-lg text-xs font-medium flex items-center gap-2 justify-center'>
                  <CheckCircle2 className='h-4 w-4' /> Upload successful
                </div>
              ) : null}
            </div>

            <div className='w-full pt-6 mt-6 border-t dark:border-slate-700 flex flex-col gap-3'>
              <button
                onClick={handleSignOut}
                className='flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400 transition-colors group'
              >
                <div className='flex items-center gap-3 font-bold'>
                  <LogOut className='h-5 w-5' /> Sign Out
                </div>
                <ChevronRight className='h-4 w-4 opacity-0 group-hover:opacity-100 transition-all' />
              </button>
              <button
                onClick={handleDeleteUser}
                className='flex items-center justify-between w-full px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 transition-colors group'
              >
                <div className='flex items-center gap-3 font-bold'>
                  <Trash2 className='h-5 w-5' /> Delete Account
                </div>
                <ChevronRight className='h-4 w-4 opacity-0 group-hover:opacity-100 transition-all' />
              </button>
            </div>
          </div>

          <Link
            className='bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-3xl font-bold uppercase text-center shadow-lg hover:shadow-blue-500/30 transition-shadow flex items-center justify-center gap-2'
            to={'/create-listing'}
          >
            <PlusCircle className='h-5 w-5' /> Create Listing
          </Link>
        </div>

        {/* Edit Profile Form */}
        <div className='flex-1 space-y-8'>
          <div className='bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-xl'>
            <h1 className='text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8'>Account Settings</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Username</label>
                  <div className='relative'>
                    <input
                      type='text'
                      placeholder='username'
                      defaultValue={currentUser.username}
                      id='username'
                      className='w-full border dark:border-slate-700 p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                      onChange={handleChange}
                    />
                    <User className='absolute left-4 top-4 h-5 w-5 text-slate-400' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Email Address</label>
                  <div className='relative'>
                    <input
                      type='email'
                      placeholder='email'
                      id='email'
                      defaultValue={currentUser.email}
                      className='w-full border dark:border-slate-700 p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                      onChange={handleChange}
                    />
                    <Mail className='absolute left-4 top-4 h-5 w-5 text-slate-400' />
                  </div>
                </div>

                <div className='space-y-2'>
                  <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>New Password</label>
                  <div className='relative'>
                    <input
                      type='password'
                      placeholder='••••••••'
                      onChange={handleChange}
                      id='password'
                      className='w-full border dark:border-slate-700 p-4 pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                    />
                    <Lock className='absolute left-4 top-4 h-5 w-5 text-slate-400' />
                  </div>
                </div>
              </div>

              <div className='flex flex-col gap-4 mt-2'>
                <button
                  disabled={loading}
                  className='bg-slate-900 dark:bg-blue-600 text-white rounded-2xl p-4 font-bold uppercase hover:bg-slate-800 dark:hover:bg-blue-500 transition-all shadow-xl disabled:opacity-80 active:scale-95'
                >
                  {loading ? 'Saving Changes...' : 'Update Settings'}
                </button>
                {updateSuccess && (
                  <p className='text-center text-green-600 font-bold animate-in fade-in slide-in-from-top-2'>
                    Changes saved successfully!
                  </p>
                )}
                {error && (
                  <p className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-center font-bold'>
                    {error}
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className='bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-xl overflow-hidden'>
            <div className='flex items-center justify-between mb-8'>
              <h2 className='text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3'>
                <LayoutList className='h-6 w-6 text-blue-600' /> Your Listings
              </h2>
              <button
                onClick={handleShowListings}
                className='text-blue-600 dark:text-blue-400 font-bold hover:underline py-2'
              >
                {userListings.length > 0 ? 'Refresh List' : 'Show All'}
              </button>
            </div>

            {showListingsError && (
              <div className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center font-bold'>
                Error retrieving listings. Please try again.
              </div>
            )}

            {userListings && userListings.length > 0 ? (
              <div className='flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar'>
                {userListings.map((listing) => (
                  <div
                    key={listing._id}
                    className='bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 flex items-center gap-4 group border border-transparent hover:border-blue-100 dark:hover:border-blue-900 transition-all'
                  >
                    <Link to={`/listing/${listing._id}`} className='shrink-0'>
                      <img
                        src={listing.imageUrls[0]}
                        alt='listing'
                        className='h-20 w-24 object-cover rounded-xl shadow-sm'
                      />
                    </Link>
                    <Link
                      className='flex-1 min-w-0'
                      to={`/listing/${listing._id}`}
                    >
                      <h3 className='text-slate-800 dark:text-slate-100 font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors'>
                        {listing.name}
                      </h3>
                      <p className='text-slate-500 text-sm font-medium'>
                        ${listing.regularPrice.toLocaleString()} {listing.type === 'rent' ? '/ mo' : ''}
                      </p>
                    </Link>

                    <div className='flex gap-2'>
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className='bg-white dark:bg-slate-800 p-2.5 rounded-xl text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border dark:border-slate-700 shadow-sm'>
                          <PlusCircle className='h-5 w-5' />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleListingDelete(listing._id)}
                        className='bg-white dark:bg-slate-800 p-2.5 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border dark:border-slate-700 shadow-sm'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='text-center py-10 text-slate-400'>
                <p className='font-medium'>No listings found. Start and create one today!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

