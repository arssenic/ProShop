import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const stepClasses = (isActive) =>
    `flex-1 text-center py-3 font-semibold transition-all duration-200 ${
      isActive
        ? 'bg-blue-600 text-white border-b-4 border-blue-700'
        : 'bg-gray-200 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
    }`;

  return (
    <div className='flex gap-0 mb-8 rounded-lg overflow-hidden shadow-md'>
      <div className={stepClasses(step1)}>
        {step1 ? (
          <Link to='/login' className='block'>
            Sign In
          </Link>
        ) : (
          <span className='opacity-50 cursor-not-allowed'>Sign In</span>
        )}
      </div>

      <div className={stepClasses(step2)}>
        {step2 ? (
          <Link to='/shipping' className='block'>
            Shipping
          </Link>
        ) : (
          <span className='opacity-50 cursor-not-allowed'>Shipping</span>
        )}
      </div>

      <div className={stepClasses(step3)}>
        {step3 ? (
          <Link to='/payment' className='block'>
            Payment
          </Link>
        ) : (
          <span className='opacity-50 cursor-not-allowed'>Payment</span>
        )}
      </div>

      <div className={stepClasses(step4)}>
        {step4 ? (
          <Link to='/placeorder' className='block'>
            Place Order
          </Link>
        ) : (
          <span className='opacity-50 cursor-not-allowed'>Place Order</span>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
