import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import Loader from '../components/Loader';
import { useCreateOrderMutation } from '../slices/ordersApiSlice';
import { clearCartItems } from '../slices/cartSlice';

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  useEffect(() => {
    if (!cart.shippingAddress.address) {
      navigate('/shipping');
    } else if (!cart.paymentMethod) {
      navigate('/payment');
    }
  }, [cart.paymentMethod, cart.shippingAddress.address, navigate]);

  const dispatch = useDispatch();
  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: cart.itemsPrice,
        shippingPrice: cart.shippingPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      toast.error(err);
    }
  };

  return (
  <div className="relative min-h-[70vh] px-4 py-10 overflow-hidden">
    {/* Ambient Glow */}
    <div className="absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5" />

    {/* Checkout Steps */}
    <div className="max-w-6xl mx-auto mb-8 relative z-10">
      <CheckoutSteps step1 step2 step3 step4 />
    </div>

    <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6 relative z-10">
      
      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Shipping */}
        <div className="premium-card">
          <h2 className="text-xl font-bold mb-4">Shipping</h2>

          <p className="text-slate-600 dark:text-slate-400">
            <strong>Address:</strong>{' '}
            {cart.shippingAddress.address},
            {' '}
            {cart.shippingAddress.city},
            {' '}
            {cart.shippingAddress.postalCode},
            {' '}
            {cart.shippingAddress.country}
          </p>
        </div>

        {/* Payment */}
        <div className="premium-card">
          <h2 className="text-xl font-bold mb-4">
            Payment Method
          </h2>

          <p className="text-slate-600 dark:text-slate-400">
            <strong>Method:</strong> {cart.paymentMethod}
          </p>
        </div>

        {/* Order Items */}
        <div className="premium-card">
          <h2 className="text-xl font-bold mb-4">
            Order Items
          </h2>

          {cart.cartItems.length === 0 ? (
            <Message>Your cart is empty</Message>
          ) : (
            <div className="space-y-4">
              {cart.cartItems.map((item) => (
                <div
                  key={item.product}
                  className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-700 pb-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />

                  <div className="flex-1">
                    <Link
                      to={`/product/${item.product}`}
                      className="font-medium hover:text-indigo-600"
                    >
                      {item.name}
                    </Link>
                  </div>

                  <div className="text-sm font-medium">
                    {item.qty} × ${item.price}
                  </div>

                  <div className="font-semibold">
                    $
                    {(item.qty * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div>
        <div className="premium-card sticky top-24">
          <h2 className="text-xl font-bold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Items</span>
              <span>${cart.itemsPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${cart.shippingPrice}</span>
            </div>

            <div className="flex justify-between">
              <span>Tax</span>
              <span>${cart.taxPrice}</span>
            </div>

            <div className="border-t pt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${cart.totalPrice}</span>
            </div>

            {error && (
              <Message variant="danger">
                {error?.data?.message}
              </Message>
            )}

            <button
              type="button"
              disabled={cart.cartItems.length === 0}
              onClick={placeOrderHandler}
              className={`w-full h-12 rounded-2xl font-semibold uppercase tracking-wide text-sm text-white
                transition-all duration-300
                ${
                  cart.cartItems.length === 0
                    ? 'opacity-50 cursor-not-allowed bg-slate-400'
                    : 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 hover:shadow-lg hover:shadow-slate-900/30'
                }`}
            >
              Place Order
            </button>

            {isLoading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default PlaceOrderScreen;
