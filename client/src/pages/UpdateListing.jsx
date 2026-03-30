import { useEffect, useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Save,
  Image as ImageIcon,
  Trash2,
  Upload,
  MapPin,
  Info,
  Home,
  Bed,
  Bath,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus
} from 'lucide-react';
import { cn } from '../utils/cn';

export default function UpdateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const res = await fetch(`/api/listing/get/${listingId}`);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, []);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 1)
        return setError('You must upload at least one image');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className='max-w-5xl mx-auto p-6 py-12 bg-white dark:bg-slate-900 transition-colors duration-300 min-h-screen'>
      <div className='flex flex-col gap-2 mb-10'>
        <h1 className='text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight'>
          Update Listing
        </h1>
        <p className='text-slate-500 dark:text-slate-400 font-medium'>
          Modify your property details to attract more potential clients
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col lg:flex-row gap-10'>
        {/* Left Side: Property Details */}
        <div className='flex-1 space-y-8'>
          <div className='bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-xl space-y-6'>
            <div className='flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-700 pb-4'>
              <Home className='h-5 w-5 text-blue-600' /> Property Details
            </div>

            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Property Name</label>
                <input
                  type='text'
                  placeholder='Modern Apartment'
                  className='w-full border dark:border-slate-700 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                  id='name'
                  maxLength='62'
                  minLength='10'
                  required
                  onChange={handleChange}
                  value={formData.name}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Description</label>
                <textarea
                  type='text'
                  placeholder='Description...'
                  className='w-full border dark:border-slate-700 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200 min-h-[120px]'
                  id='description'
                  required
                  onChange={handleChange}
                  value={formData.description}
                />
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Address</label>
                <div className='relative'>
                  <input
                    type='text'
                    placeholder='Address'
                    className='w-full border dark:border-slate-700 p-4 pl-12 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                    id='address'
                    required
                    onChange={handleChange}
                    value={formData.address}
                  />
                  <MapPin className='absolute left-4 top-4 h-5 w-5 text-slate-400' />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4'>
              <div className='flex flex-col gap-3'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Type</label>
                <div className='flex gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl'>
                  <button
                    type='button'
                    onClick={() => setFormData({ ...formData, type: 'rent' })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all',
                      formData.type === 'rent'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >Rent</button>
                  <button
                    type='button'
                    onClick={() => setFormData({ ...formData, type: 'sale' })}
                    className={cn(
                      'flex-1 py-2 px-4 rounded-lg text-sm font-bold transition-all',
                      formData.type === 'sale'
                        ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    )}
                  >Sale</button>
                </div>
              </div>

              <div className='flex flex-col gap-3 col-span-2 sm:col-span-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Amenities</label>
                <div className='flex flex-wrap gap-4'>
                  {[
                    { id: 'parking', label: 'Parking' },
                    { id: 'furnished', label: 'Furnished' },
                    { id: 'offer', label: 'Offer' }
                  ].map((item) => (
                    <label key={item.id} className='flex items-center gap-2 cursor-pointer group'>
                      <div className='relative flex items-center shrink-0'>
                        <input
                          type='checkbox'
                          id={item.id}
                          className='peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-slate-300 dark:border-slate-700 transition-all checked:bg-blue-600 checked:border-blue-600'
                          onChange={handleChange}
                          checked={formData[item.id]}
                        />
                        <Plus className='absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 ml-1' />
                      </div>
                      <span className='text-sm font-medium text-slate-600 dark:text-slate-400 group-hover:text-blue-600 transition-colors'>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-6 pt-4'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>
                  <Bed className='h-4 w-4 text-blue-600' /> No. of BHK
                </div>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='w-full border dark:border-slate-700 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>
                  <Bath className='h-4 w-4 text-blue-600' /> Bathrooms
                </div>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='w-full border dark:border-slate-700 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-xl space-y-6'>
            <div className='flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-700 pb-4'>
              <Info className='h-5 w-5 text-blue-600' /> Pricing Details
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
              <div className='space-y-2'>
                <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>
                  Regular Price {formData.type === 'rent' && <span className='font-normal text-slate-500'>(₹ / month)</span>}
                </label>
                <div className='relative'>
                  <input
                    type='number'
                    id='regularPrice'
                    min='50'
                    max='10000000'
                    required
                    className='w-full border dark:border-slate-700 p-4 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                    onChange={handleChange}
                    value={formData.regularPrice}
                  />
                  <span className='absolute left-4 top-4 font-bold text-slate-400'>₹</span>
                </div>
              </div>

              {formData.offer && (
                <div className='space-y-2 animate-in fade-in zoom-in-95 duration-300'>
                  <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>
                    Discounted Price {formData.type === 'rent' && <span className='font-normal text-slate-500'>(₹ / month)</span>}
                  </label>
                  <div className='relative'>
                    <input
                      type='number'
                      id='discountPrice'
                      min='0'
                      max='10000000'
                      required
                      className='w-full border dark:border-slate-700 p-4 pl-10 rounded-xl bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                      onChange={handleChange}
                      value={formData.discountPrice}
                    />
                    <span className='absolute left-4 top-4 font-bold text-slate-400'>₹</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Media & Actions */}
        <div className='w-full lg:w-[400px] space-y-8'>
          <div className='bg-white dark:bg-slate-800 p-8 rounded-3xl border dark:border-slate-700 shadow-xl space-y-6'>
            <div className='flex items-center gap-3 text-lg font-bold text-slate-800 dark:text-slate-100 border-b dark:border-slate-700 pb-4'>
              <ImageIcon className='h-5 w-5 text-blue-600' /> Property Images
            </div>

            <p className='text-sm text-slate-500 dark:text-slate-400 font-medium'>
              Max 6 images. First image is the cover.
            </p>

            <div className='space-y-4'>
              <div className='flex flex-col gap-4'>
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  className='hidden'
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                  ref={(ref) => (window.fileUpdateInput = ref)}
                />
                <button
                  type='button'
                  onClick={() => window.fileUpdateInput.click()}
                  className='w-full border-2 border-dashed border-slate-300 dark:border-slate-700 p-8 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-blue-500 dark:hover:border-blue-500 transition-all group'
                >
                  <Upload className='h-8 w-8 text-slate-400 group-hover:text-blue-600 group-hover:-translate-y-1 transition-all' />
                  <span className='text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'>
                    {files.length > 0 ? `${files.length} files selected` : 'Click to select images'}
                  </span>
                </button>
                <button
                  type='button'
                  disabled={uploading || files.length === 0}
                  onClick={handleImageSubmit}
                  className='w-full bg-blue-600 text-white p-3 rounded-xl font-bold uppercase hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {uploading ? <Loader2 className='h-5 w-5 animate-spin' /> : <CheckCircle2 className='h-5 w-5' />}
                  {uploading ? 'Processing...' : 'Upload Images'}
                </button>
              </div>

              {imageUploadError && (
                <p className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold flex items-center gap-2'>
                  <AlertCircle className='h-4 w-4' /> {imageUploadError}
                </p>
              )}

              <div className='grid grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'>
                {formData.imageUrls.map((url, index) => (
                  <div key={url} className='relative group aspect-square rounded-xl overflow-hidden shadow-sm border dark:border-slate-700'>
                    <img src={url} alt='listing' className='h-full w-full object-cover group-hover:scale-110 transition-transform duration-500' />
                    <div className='absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                      <button
                        type='button'
                        onClick={() => handleRemoveImage(index)}
                        className='bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-900/40'
                      >
                        <Trash2 className='h-4 w-4' />
                      </button>
                    </div>
                    {index === 0 && (
                      <div className='absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg uppercase tracking-wider'>Cover</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <button
              disabled={loading || uploading}
              className='w-full bg-slate-900 dark:bg-blue-600 text-white p-5 rounded-2xl font-bold uppercase text-lg hover:shadow-2xl hover:-translate-y-1 transition-all shadow-xl disabled:opacity-70 active:scale-95 flex items-center justify-center gap-3'
            >
              {loading ? <Loader2 className='h-6 w-6 animate-spin' /> : <Save className='h-6 w-6' />}
              {loading ? 'Updating...' : 'Save Updates'}
            </button>
            {error && (
              <div className='bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center font-bold flex items-center gap-2 justify-center'>
                <AlertCircle className='h-5 w-5' /> {error}
              </div>
            )}
          </div>
        </div>
      </form>
    </main>
  );
}

