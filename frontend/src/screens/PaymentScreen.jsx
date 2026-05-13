import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { savePaymentMethod } from '../slices/cartSlice';

const PaymentScreen = () => {
  const navigate = useNavigate();
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className='mb-6'>Payment Method</h1>
      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-4'>Select Payment Method</label>
          <div className='space-y-3'>
            <label className='flex items-center p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors'>
              <input
                type='radio'
                name='paymentMethod'
                value='PayPal'
                checked={paymentMethod === 'PayPal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className='w-4 h-4 text-blue-600'
              />
              <span className='ml-3 text-gray-900 dark:text-white font-medium'>
                PayPal or Credit Card
              </span>
            </label>
          </div>
        </div>

        <button type='submit' className='btn-primary w-full'>
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default PaymentScreen;
