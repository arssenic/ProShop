import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../components/Loader';
import FormContainer from '../components/FormContainer';

import { useRegisterMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

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
    } else {
      try {
        const res = await register({ name, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <FormContainer>
      <h1 className='mb-6'>Register</h1>
      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <label htmlFor='name' className='block text-sm font-medium mb-2'>
            Name
          </label>
          <input
            id='name'
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='input-field'
          />
        </div>

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

        <div>
          <label htmlFor='confirmPassword' className='block text-sm font-medium mb-2'>
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            type='password'
            placeholder='Confirm password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='input-field'
          />
        </div>

        <button
          disabled={isLoading}
          type='submit'
          className='btn-primary w-full'
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>

        {isLoading && <Loader />}
      </form>

      <div className='mt-6 pt-6 border-t border-gray-300 dark:border-gray-600'>
        <p className='text-sm'>
          Already have an account?{' '}
          <Link
            to={redirect ? `/login?redirect=${redirect}` : '/login'}
            className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'
          >
            Login
          </Link>
        </p>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;