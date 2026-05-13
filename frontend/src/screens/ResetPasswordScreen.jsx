import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useResetPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ResetPasswordScreen = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      const res = await resetPassword({
        token,
        data: { password, confirmPassword },
      }).unwrap();
      toast.success(res.message || 'Password reset successfully');
      setPassword('');
      setConfirmPassword('');
      // Redirect to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to reset password');
    }
  };

  return (
    <FormContainer>
      <h1 className='mb-6'>Reset Password</h1>

      <p className='text-sm text-slate-600 dark:text-slate-400 mb-6'>
        Enter your new password below.
      </p>

      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <label htmlFor='password' className='block text-sm font-medium mb-2'>
            New Password
          </label>
          <input
            id='password'
            type='password'
            placeholder='Enter new password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input-field'
            required
          />
        </div>

        <div>
          <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            type='password'
            placeholder='Confirm new password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='input-field'
            required
          />
        </div>

        <button
          disabled={isLoading}
          type='submit'
          className='btn-primary w-full'
        >
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>

        {isLoading && <Loader />}
      </form>

      <div className='mt-6 pt-6 border-t border-gray-300 dark:border-gray-600'>
        <p className='text-sm'>
          <a
            href='/login'
            className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'
          >
            Back to Sign In
          </a>
        </p>
      </div>
    </FormContainer>
  );
};

export default ResetPasswordScreen;
