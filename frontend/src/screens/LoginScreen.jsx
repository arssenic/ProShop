import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

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
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer>
      <h1 className='mb-6'>Sign In</h1>

      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <label htmlFor='email' className='block text-sm font-medium mb-2'>
            Email Address
          </label>
          <input
            id='email'
            type='email'
            placeholder='Enter email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='input-field'
          />
        </div>

        <div>
          <label htmlFor='password' className='block text-sm font-medium mb-2'>
            Password
          </label>
          <input
            id='password'
            type='password'
            placeholder='Enter password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='input-field'
          />
        </div>

        <button
          disabled={isLoading}
          type='submit'
          className='btn-primary w-full'
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>

        {isLoading && <Loader />}
      </form>

      <div className='mt-6 pt-6 border-t border-gray-300 dark:border-gray-600'>
        <p className='text-sm mb-4'>
          New Customer?{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'
          >
            Register
          </Link>
        </p>
        <p className='text-sm'>
          Forgot your password?{' '}
          <Link
            to='/forgot-password'
            className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'
          >
            Reset it here
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;
