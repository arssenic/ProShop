import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPaypalClientIdQuery,
  usePayOrderMutation,
} from '../slices/ordersApiSlice';

const OrderScreen = () => {
  const { id: orderId } = useParams();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': paypal.clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success('Order is paid');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    });
  }

  // TESTING ONLY! REMOVE BEFORE PRODUCTION
  // async function onApproveTest() {
  //   await payOrder({ orderId, details: { payer: {} } });
  //   refetch();

  //   toast.success('Order is paid');
  // }

  function onError(err) {
    toast.error(err.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const deliverHandler = async () => {
    await deliverOrder(orderId);
    refetch();
  };

  return isLoading ? (
  <Loader />
) : error ? (
  <Message variant='danger'>{error.data.message}</Message>
) : (
  <div className="relative min-h-[70vh] px-4 py-10 overflow-hidden">
    {/* Ambient Glow */}
    <div className="absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5" />

    <div className="max-w-6xl mx-auto relative z-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Order Details
        </h1>

        <p className="text-sm text-slate-500 mt-1">
          Order ID: {order._id}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2">
          <div className="premium-card">
            <section>
            <h2 className="text-xl font-bold mb-4">
              Shipping Information
            </h2>

            <div className="space-y-2 text-slate-600 dark:text-slate-400">
              <p><strong>Name:</strong> {order.user.name}</p>

              <p>
                <strong>Email:</strong>{' '}
                <a
                  href={`mailto:${order.user.email}`}
                  className="text-indigo-600 dark:text-indigo-400"
                >
                  {order.user.email}
                </a>
              </p>

              <p>
                <strong>Address:</strong>{' '}
                {order.shippingAddress.address},
                {' '}
                {order.shippingAddress.city},
                {' '}
                {order.shippingAddress.postalCode},
                {' '}
                {order.shippingAddress.country}
              </p>
            </div>

            <div className="mt-4">
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">
                  Not Delivered
                </Message>
              )}
            </div>
          </section>

          <div className="my-8 border-t border-slate-200 dark:border-slate-700" />
          <section>
            <h2 className="text-xl font-bold mb-4">
              Payment Method
            </h2>

            <p>
              <strong>Method:</strong> {order.paymentMethod}
            </p>

            <div className="mt-4">
              {order.isPaid ? (
                <Message variant="success">
                  Paid on {order.paidAt}
                </Message>
              ) : (
                <Message variant="danger">
                  Not Paid
                </Message>
              )}
            </div>
          </section>

          <div className="my-8 border-t border-slate-200 dark:border-slate-700" />
          <section>
            <h2 className="text-xl font-bold mb-4">
              Order Items
            </h2>

            {order.orderItems.length === 0 ? (
              <Message>Order is empty</Message>
            ) : (
              <div className="space-y-4">
                {order.orderItems.map((item) => (
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

                    <div className="text-sm">
                      {item.qty} × ${item.price}
                    </div>

                    <div className="font-semibold">
                      ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
        </div>

        {/* RIGHT COLUMN */}
        <div>
          <div className="premium-card sticky top-24">
            <h2 className="text-xl font-bold mb-6">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Items</span>
                <span>${order.itemsPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Shipping</span>
                <span>${order.shippingPrice}</span>
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>${order.taxPrice}</span>
              </div>

              <div className="border-t pt-4 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${order.totalPrice}</span>
              </div>

              {!order.isPaid && (
                <>
                  {loadingPay && <Loader />}

                  {isPending ? (
                    <Loader />
                  ) : (
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  )}
                </>
              )}

              {loadingDeliver && <Loader />}

              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <button
                    type="button"
                    onClick={deliverHandler}
                    className="w-full h-12 rounded-2xl font-semibold uppercase tracking-wide text-sm text-white
                    bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950
                    hover:shadow-lg hover:shadow-slate-900/30
                    transition-all duration-300"
                  >
                    Mark As Delivered
                  </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default OrderScreen;
