import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

import {
  FaMapMarkerAlt,
  FaCity,
  FaMailBulk,
  FaGlobe,
  FaTruck,
} from 'react-icons/fa';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(
    shippingAddress.address || ''
  );
  const [city, setCity] = useState(
    shippingAddress.city || ''
  );
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(
    shippingAddress.country || ''
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();

    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        country,
      })
    );

    navigate('/payment');
  };

  return (
    <div className='relative flex min-h-[70vh] flex-col items-center px-4 py-10 overflow-hidden'>
      {/* Ambient Glow */}
      <div className='absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5' />

      {/* Checkout Steps */}
      <div className='w-full max-w-3xl mb-8 relative z-10'>
        <CheckoutSteps step1 step2 />
      </div>

      {/* Shipping Card */}
      <div className='premium-card w-full max-w-md space-y-6 border border-slate-200/60 dark:border-slate-800/60 relative z-10'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20'>
            <FaTruck className='text-sm' />
          </div>

          <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Shipping Address
          </h2>

          <p className='text-xs text-slate-400 dark:text-slate-500'>
            Enter your delivery information
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className='space-y-4'>
          {/* Address */}
          <div className='space-y-1.5'>
            <label
              htmlFor='address'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Address
            </label>

            <div className='relative flex items-center'>
              <input
                id='address'
                type='text'
                placeholder='Enter address'
                value={address}
                required
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className='premium-input !pl-12'
              />

              <FaMapMarkerAlt className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* City */}
          <div className='space-y-1.5'>
            <label
              htmlFor='city'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              City
            </label>

            <div className='relative flex items-center'>
              <input
                id='city'
                type='text'
                placeholder='Enter city'
                value={city}
                required
                onChange={(e) =>
                  setCity(e.target.value)
                }
                className='premium-input !pl-12'
              />

              <FaCity className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Postal Code */}
          <div className='space-y-1.5'>
            <label
              htmlFor='postalCode'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Postal Code
            </label>

            <div className='relative flex items-center'>
              <input
                id='postalCode'
                type='text'
                placeholder='Enter postal code'
                value={postalCode}
                required
                onChange={(e) =>
                  setPostalCode(e.target.value)
                }
                className='premium-input !pl-12'
              />

              <FaMailBulk className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Country */}
          <div className='space-y-1.5'>
            <label
              htmlFor='country'
              className='text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500'
            >
              Country
            </label>

            <div className='relative flex items-center'>
              <input
                id='country'
                type='text'
                placeholder='Enter country'
                value={country}
                required
                onChange={(e) =>
                  setCountry(e.target.value)
                }
                className='premium-input !pl-12'
              />

              <FaGlobe className='absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none' />
            </div>
          </div>

          {/* Button */}
          <button
            type='submit'
            className='premium-btn-primary w-full h-11 mt-2'
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;