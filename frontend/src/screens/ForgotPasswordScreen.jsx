import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';

import { FaEnvelope, FaKey } from 'react-icons/fa';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] =
    useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await forgotPassword({
        email,
      }).unwrap();

      toast.success(
        res.message ||
          'Reset link sent to your email'
      );

      setEmail('');

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err.error ||
          'Failed to send reset link'
      );
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
            <FaKey className='text-sm' />
          </div>

          <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Forgot Password
          </h2>

          <p className='text-xs text-slate-400 dark:text-slate-500'>
            Enter your email and we'll send you a password reset link
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className='space-y-4'
        >
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
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
                className='premium-input !pl-12'
              />

              <FaEnvelope className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          <button
            disabled={isLoading}
            type='submit'
            className='premium-btn-primary w-full h-11 mt-2'
          >
            {isLoading ? (
              <span className='inline-flex items-center gap-2'>
                <span className='h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Sending Link...
              </span>
            ) : (
              'Send Reset Link'
            )}
          </button>

          {isLoading && <Loader />}
        </form>

        {/* Footer */}
        <div className='border-t border-slate-100 pt-4 text-center text-xs dark:border-slate-800/60'>
          <span className='text-slate-400 dark:text-slate-500'>
            Remember your password?
          </span>{' '}
          <Link
            to='/login'
            className='font-semibold text-indigo-600 hover:underline dark:text-indigo-400'
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;