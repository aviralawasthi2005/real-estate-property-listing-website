import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from '../redux/user/userSlice';
import OAuth from '../components/OAuth';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { cn } from '../utils/cn';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='min-h-[calc(100-80px)] flex flex-col items-center justify-center p-6'>
      <div className='max-w-md w-full bg-white dark:bg-slate-900 shadow-2xl rounded-3xl p-8 border dark:border-slate-800 transition-all duration-300'>
        <div className='text-center mb-10'>
          <div className='bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30'>
            <LogIn className='text-white h-8 w-8' />
          </div>
          <h1 className='text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight'>Welcome Back</h1>
          <p className='text-slate-500 dark:text-slate-400 mt-2 font-medium'>Sign in to manage your property journey</p>
        </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
          <div className='space-y-2'>
            <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Email Address</label>
            <div className='relative'>
              <input
                type='email'
                placeholder='name@example.com'
                className='w-full border dark:border-slate-700 p-4 pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                id='email'
                onChange={handleChange}
              />
              <Mail className='absolute left-4 top-4 h-5 w-5 text-slate-400' />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-bold text-slate-700 dark:text-slate-300 ml-1'>Password</label>
            <div className='relative'>
              <input
                type='password'
                placeholder='••••••••'
                className='w-full border dark:border-slate-700 p-4 pl-12 rounded-xl bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-slate-200'
                id='password'
                onChange={handleChange}
              />
              <Lock className='absolute left-4 top-4 h-5 w-5 text-slate-400' />
            </div>
          </div>

          <button
            disabled={loading}
            className='w-full bg-blue-600 text-white p-4 rounded-xl font-bold uppercase hover:bg-blue-700 transition-all shadow-lg active:scale-95 disabled:opacity-70 mt-2'
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>

          <div className='relative my-4'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t dark:border-slate-700'></div>
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-white dark:bg-slate-900 px-2 text-slate-500'>Or continue with</span>
            </div>
          </div>

          <OAuth />
        </form>

        <div className='mt-8 flex flex-col gap-4 text-center'>
          <p className='text-slate-600 dark:text-slate-400'>
            Don't have an account?{' '}
            <Link to='/sign-up' className='text-blue-600 font-bold hover:underline inline-flex items-center gap-1'>
              Sign up <ArrowRight className='h-4 w-4' />
            </Link>
          </p>
          {error && (
            <div className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium'>
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

