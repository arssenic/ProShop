import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../slices/cartSlice';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className='mb-6'>Shipping Address</h1>
      <form onSubmit={submitHandler} className='space-y-4'>
        <div>
          <label htmlFor='address' className='block text-sm font-medium mb-2'>
            Address
          </label>
          <input
            id='address'
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            className='input-field'
          />
        </div>

        <div>
          <label htmlFor='city' className='block text-sm font-medium mb-2'>
            City
          </label>
          <input
            id='city'
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
            className='input-field'
          />
        </div>

        <div>
          <label htmlFor='postalCode' className='block text-sm font-medium mb-2'>
            Postal Code
          </label>
          <input
            id='postalCode'
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
            className='input-field'
          />
        </div>

        <div>
          <label htmlFor='country' className='block text-sm font-medium mb-2'>
            Country
          </label>
          <input
            id='country'
            type='text'
            placeholder='Enter country'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
            className='input-field'
          />
        </div>

        <button type='submit' className='btn-primary w-full'>
          Continue
        </button>
      </form>
    </FormContainer>
  );
};

export default ShippingScreen;
