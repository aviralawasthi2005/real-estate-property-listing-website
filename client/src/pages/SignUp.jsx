import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { User, Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      navigate('/sign-in');
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  return (
    <div className='min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 sm:p-6 pt-24'>
      <div className='max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 transition-all space-y-6'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='h-14 w-14 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30 text-white'>
            <UserPlus className='h-7 w-7' />
          </div>
          <h1 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight'>
            Create Your Account
          </h1>
          <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium'>
            Join PrimeEstate to discover and list dream properties
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className='p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 flex items-center gap-2.5 text-xs text-red-600 dark:text-red-400 font-medium'>
            <AlertCircle className='h-4 w-4 shrink-0' />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-700 dark:text-slate-300 ml-1'>
              Username
            </label>
            <div className='relative'>
              <input
                type='text'
                placeholder='johndoe'
                required
                className='input-field text-sm pl-11'
                id='username'
                onChange={handleChange}
              />
              <User className='absolute left-3.5 top-3.5 h-4 w-4 text-slate-400' />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-700 dark:text-slate-300 ml-1'>
              Email Address
            </label>
            <div className='relative'>
              <input
                type='email'
                placeholder='name@example.com'
                required
                className='input-field text-sm pl-11'
                id='email'
                onChange={handleChange}
              />
              <Mail className='absolute left-3.5 top-3.5 h-4 w-4 text-slate-400' />
            </div>
          </div>

          <div className='space-y-1.5'>
            <label className='text-xs font-bold text-slate-700 dark:text-slate-300 ml-1'>
              Password
            </label>
            <div className='relative'>
              <input
                type='password'
                placeholder='••••••••'
                required
                className='input-field text-sm pl-11'
                id='password'
                onChange={handleChange}
              />
              <Lock className='absolute left-3.5 top-3.5 h-4 w-4 text-slate-400' />
            </div>
          </div>

          <button
            disabled={loading}
            className='btn-primary w-full py-3.5 text-sm justify-center mt-2'
          >
            {loading ? 'Creating Account...' : 'Get Started'}
          </button>

          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-slate-200 dark:border-slate-800' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold'>
                Or sign up with
              </span>
            </div>
          </div>

          {/* Google OAuth Button */}
          <OAuth />
        </form>

        {/* Footer */}
        <div className='text-center text-xs text-slate-500 pt-2'>
          Already have an account?{' '}
          <Link to='/sign-in' className='text-indigo-600 dark:text-indigo-400 font-bold hover:underline'>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
