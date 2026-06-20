import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className='relative flex min-h-[70vh] flex-col items-center px-4 py-10 overflow-hidden'>
      {/* Ambient Glow */}
      <div className='absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5' />

      {/* Checkout Steps */}
      <div className='w-full max-w-3xl mb-8 relative z-10'>
        <CheckoutSteps step1 step2 step3 />
      </div>

      {/* Payment Card */}
      <div className='premium-card w-full max-w-md space-y-6 border border-slate-200/60 dark:border-slate-800/60 relative z-10'>
        {/* Header */}
        <div className='text-center space-y-2'>
          <div className='mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20'>
            💳
          </div>

          <h2 className='text-2xl font-bold tracking-tight text-slate-900 dark:text-white'>
            Payment Method
          </h2>

          <p className='text-xs text-slate-400 dark:text-slate-500'>
            Choose your preferred payment option
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className='space-y-4'>
          <div>
            <label className='block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3'>
              Select Payment Method
            </label>

            <label
              className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                ${
                  paymentMethod === 'PayPal'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                }`}
            >
              <input
                type='radio'
                name='paymentMethod'
                value='PayPal'
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className='h-4 w-4 text-indigo-600'
              />

              <div className='ml-3'>
                <p className='font-medium text-slate-900 dark:text-white'>
                  PayPal or Credit Card
                </p>

                <p className='text-xs text-slate-500 dark:text-slate-400'>
                  Secure online payment
                </p>
              </div>
            </label>
          </div>

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

export default PaymentScreen;