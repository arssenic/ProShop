import React, { useEffect, useState } from 'react';
import { Table, Form, Button} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useProfileMutation } from '../slices/usersApiSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { Link } from 'react-router-dom';
import {FaUser,FaEnvelope,FaLock,FaUserCircle,FaBoxOpen,} from 'react-icons/fa';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);

  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  useEffect(() => {
    setName(userInfo.name);
    setEmail(userInfo.email);
  }, [userInfo.email, userInfo.name]);

  const dispatch = useDispatch();
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await updateProfile({
          name,
          email,
          password,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
  <div className="relative min-h-[70vh] px-4 py-10 overflow-hidden">
    {/* Ambient Glow */}
    <div className="absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5" />

    <div className="max-w-7xl mx-auto grid lg:grid-cols-[380px_1fr] gap-6 relative z-10">
      
      {/* PROFILE CARD */}
      <div className="premium-card">
        <div className="text-center mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <FaUserCircle />
          </div>

          <h2 className="text-2xl font-bold mt-3">
            User Profile
          </h2>

          <p className="text-sm text-slate-500 dark:text-slate-400">
            Update your account information
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Name
            </label>

            <div className="relative flex items-center mt-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="premium-input !pl-12"
              />

              <FaUser className="absolute left-4 text-slate-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Email Address
            </label>

            <div className="relative flex items-center mt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input !pl-12"
              />

              <FaEnvelope className="absolute left-4 text-slate-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Password
            </label>

            <div className="relative flex items-center mt-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="premium-input !pl-12"
              />

              <FaLock className="absolute left-4 text-slate-400" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Confirm Password
            </label>

            <div className="relative flex items-center mt-1">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="premium-input !pl-12"
              />

              <FaLock className="absolute left-4 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            className="premium-btn-primary w-full h-11"
          >
            Update Profile
          </button>

          {loadingUpdateProfile && <Loader />}
        </form>
      </div>

      {/* ORDERS CARD */}
      <div className="premium-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-500/10">
            <FaBoxOpen className="text-indigo-600" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              My Orders
            </h2>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Track and manage your purchases
            </p>
          </div>
        </div>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : orders.length === 0 ? (
          <Message>No orders found.</Message>
        ) : (
          <div className="space-y-4">
              <div className="hidden md:grid md:grid-cols-[1.2fr_0.8fr_1fr_1fr_0.8fr] gap-4 px-6 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                <div>Order ID</div>
                <div>Total</div>
                <div>Payment</div>
                <div>Delivery</div>
                <div className="text-center">Action</div>
              </div>

              {orders.map((order) => (
                <div
                  key={order._id}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
                >
                  <div className="grid md:grid-cols-[1.2fr_0.8fr_1fr_1fr_0.8fr] gap-4 items-center">

                    {/* Order ID */}
                    <div>
                      <p className="font-semibold text-lg">
                        #{order._id.slice(-8)}
                      </p>

                      <p className="text-sm text-slate-500">
                        {order.createdAt.substring(0, 10)}
                      </p>
                    </div>

                    {/* Total */}
                    <div className="font-semibold text-lg">
                      ${order.totalPrice.toFixed(2)}
                    </div>

                    {/* Payment Status */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </div>

                    {/* Delivery Status */}
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          order.isDelivered
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {order.isDelivered
                          ? 'Delivered'
                          : 'Pending'}
                      </span>
                    </div>

                    {/* Details Button */}
                    <div className="flex justify-center md:justify-end">
                      <Link
                        to={`/order/${order._id}`}
                        className="w-full md:w-auto h-12 rounded-2xl font-semibold uppercase tracking-wide text-sm text-white
                        bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950
                        hover:shadow-lg hover:shadow-slate-900/30
                        transition-all duration-300
                        flex items-center justify-center px-6"
                      >
                        Details
                      </Link>
                    </div>

                  </div>
                </div>
              ))}
            </div>
        )}
      </div>
    </div>
  </div>
);
};

export default ProfileScreen;
