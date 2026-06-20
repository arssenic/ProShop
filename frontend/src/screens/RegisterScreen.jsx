import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';

import Loader from '../components/Loader';

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaUserPlus,
} from 'react-icons/fa';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='relative flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden'>
      {/* Ambient Glow */}
      <div className='absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5' />

      <div className='premium-card w-full max-w-md space-y-6 border border-slate-200/60 dark:border-slate-800/60'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20'>
            <FaUserPlus className='text-sm' />
          </div>

          <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Create Account
          </h2>

          <p className='text-xs text-slate-400 dark:text-slate-500'>
            Register to access your ProShop account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className='space-y-4'>
          {/* Name */}
          <div className='space-y-1.5'>
            <label
              htmlFor='name'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Name
            </label>

            <div className='relative flex items-center'>
              <input
                id='name'
                type='text'
                placeholder='Enter your name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='premium-input !pl-12'
              />

              <FaUser className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Email */}
          <div className='space-y-1.5'>
            <label
              htmlFor='email'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Email Address
            </label>

            <div className='relative flex items-center'>
              <input
                id='email'
                type='email'
                placeholder='name@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className='premium-input !pl-12'
              />

              <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Password */}
          <div className='space-y-1.5'>
            <label
              htmlFor='password'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Password
            </label>

            <div className='relative flex items-center'>
              <input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='premium-input !pl-12'
              />

              <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Confirm Password */}
          <div className='space-y-1.5'>
            <label
              htmlFor='confirmPassword'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Confirm Password
            </label>

            <div className='relative flex items-center'>
              <input
                id='confirmPassword'
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className='premium-input !pl-12'
              />

              <FaLock className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={isLoading}
            type='submit'
            className='premium-btn-primary w-full h-11 mt-2'
          >
            {isLoading ? (
              <span className='inline-flex items-center gap-2'>
                <span className='h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {isLoading && <Loader />}
        </form>

        {/* Footer */}
        <div className='border-t border-slate-100 pt-4 text-center text-xs dark:border-slate-800/60'>
          <span className='text-slate-400 dark:text-slate-500'>
            Already have an account?
          </span>{' '}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className='font-semibold text-indigo-600 hover:underline dark:text-indigo-400'
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;