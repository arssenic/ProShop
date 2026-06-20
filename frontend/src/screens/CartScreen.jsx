import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import Message from '../components/Message';
import { addToCart, removeFromCart } from '../slices/cartSlice';

const CartScreen = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);
  const itemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div className='md:col-span-2'>
        <h1 className='mb-6 text-3xl font-bold'>Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Message>
            <div>
              Your cart is empty{' '}
              <Link to='/' className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'>
                Go Back
              </Link>
            </div>
          </Message>
        ) : (
          <div className='space-y-4'>
            {cartItems.map((item) => (
              <div key={item._id} className='card p-4'>
                <div className='grid grid-cols-4 md:grid-cols-5 gap-4 items-center'>
                  <div className='col-span-1'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='w-20 h-20 object-cover rounded'
                    />
                  </div>

                  <div className='col-span-1'>
                    <Link
                      to={`/product/${item._id}`}
                      className='text-blue-600 dark:text-blue-400 hover:underline font-semibold'
                    >
                      {item.name}
                    </Link>
                  </div>

                  <div className='col-span-1'>
                    <span className='font-semibold'>${item.price}</span>
                  </div>

                  <div className='col-span-1'>
                    <select
                      value={item.qty}
                      onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                      className='input-field py-1'
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className='col-span-1 flex justify-end'>
                    <button
                      type='button'
                      onClick={() => removeFromCartHandler(item._id)}
                      className='p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors'
                    >
                      <FaTrash className='text-lg' />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <div className='card p-6 sticky top-20'>
          <div className='mb-4'>
            <h2 className='text-xl font-bold mb-2'>
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </h2>
            <p className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
              ${subtotal}
            </p>
          </div>

          <button
            type="button"
            disabled={cartItems.length === 0}
            onClick={checkoutHandler}
            className={`w-full h-12 rounded-2xl font-semibold uppercase tracking-wide text-white
              transition-all duration-300
              ${
                cartItems.length === 0
                  ? 'opacity-50 cursor-not-allowed bg-slate-400'
                  : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 hover:shadow-lg hover:shadow-slate-900/30'
              }`}
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
