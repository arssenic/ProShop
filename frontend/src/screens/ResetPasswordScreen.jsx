import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import Loader from '../components/Loader';
import { useResetPasswordMutation } from '../slices/usersApiSlice';

import { FaLock, FaKey } from 'react-icons/fa';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] =
    useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error(
        'Password must be at least 6 characters'
      );
      return;
    }

    try {
      const res = await resetPassword({
        token,
        data: {
          password,
          confirmPassword,
        },
      }).unwrap();

      toast.success(
        res.message ||
          'Password reset successfully'
      );

      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err.error ||
          'Failed to reset password'
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
            Reset Password
          </h2>

          <p className='text-xs text-slate-400 dark:text-slate-500'>
            Create a new secure password for your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className='space-y-4'
        >
          {/* New Password */}
          <div className='space-y-1.5'>
            <label
              htmlFor='password'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              New Password
            </label>

            <div className='relative flex items-center'>
              <input
                id='password'
                type='password'
                placeholder='••••••••'
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
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
                placeholder='••••••••'
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
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
                Resetting Password...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>

          {isLoading && <Loader />}
        </form>

        {/* Footer */}
        <div className='border-t border-slate-100 pt-4 text-center text-xs dark:border-slate-800/60'>
          <Link
            to='/login'
            className='font-semibold text-indigo-600 hover:underline dark:text-indigo-400'
          >
            ← Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;