import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';
import { useForgotPasswordMutation } from '../slices/usersApiSlice';
import { toast } from 'react-toastify';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await forgotPassword({ email }).unwrap();
      toast.success(res.message || 'Reset link sent to your email');
      setEmail('');
      // Redirect to login after success
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || err.error || 'Failed to send reset link');
    }
  };

  return (
    <FormContainer>
      <h1 className='mb-6'>Forgot Password</h1>

      <p className='text-sm text-slate-600 dark:text-slate-400 mb-6'>
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-2'>
            Email Address
          </label>
          <input
            id='email'
            type='email'
            placeholder='Enter your email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input-field'
            required
          />
        </div>

        <button
          disabled={isLoading}
          type='submit'
          className='btn-primary w-full'
        >
          {isLoading ? 'Sending...' : 'Send Reset Link'}
        </button>

        {isLoading && <Loader />}
      </form>

      <div className='mt-6 pt-6 border-t border-gray-300 dark:border-gray-600'>
        <p className='text-sm'>
          Remember your password?{' '}
          <a
            href='/login'
            className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'
          >
            Sign In
          </a>
        </p>
      </div>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
