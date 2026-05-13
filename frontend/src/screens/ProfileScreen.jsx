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
    <div className='profile-screen space-y-8'>
      <div className='profile-hero grid gap-6 md:grid-cols-[360px_1fr]'>
        <div className='profile-panel card p-6'>
          <div className='profile-panel__header mb-6'>
            <h2 className='text-2xl font-semibold mb-2'>User Profile</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Update your account details and manage your preferences.</p>
          </div>

          <Form onSubmit={submitHandler} className='space-y-4'>
            <Form.Group className='form-group' controlId='name'>
              <Form.Label className='form-label'>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='input-field'
              ></Form.Control>
            </Form.Group>

            <Form.Group className='form-group' controlId='email'>
              <Form.Label className='form-label'>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className='input-field'
              ></Form.Control>
            </Form.Group>

            <Form.Group className='form-group' controlId='password'>
              <Form.Label className='form-label'>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='input-field'
              ></Form.Control>
            </Form.Group>

            <Form.Group className='form-group' controlId='confirmPassword'>
              <Form.Label className='form-label'>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='input-field'
              ></Form.Control>
            </Form.Group>

            <div className='flex items-center gap-4'>
              <Button type='submit' className='btn-primary w-full'>
                Update Profile
              </Button>
              {loadingUpdateProfile && <Loader />}
            </div>
          </Form>
        </div>

        <div className='order-panel card p-6'>
          <div className='order-panel__header mb-6'>
            <h2 className='text-2xl font-semibold mb-2'>My Orders</h2>
            <p className='text-sm text-slate-500 dark:text-slate-400'>Track your recent purchases and view order details.</p>
          </div>

          {isLoading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : orders.length === 0 ? (
            <Message>No orders found yet.</Message>
          ) : (
            <div className='overflow-x-auto'>
              <Table striped hover responsive className='table-sm overflow-hidden rounded-2xl'>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className='border-b border-slate-200 dark:border-slate-700'>
                      <td className='font-medium text-slate-700 dark:text-slate-200'>{order._id.substring(order._id.length - 8)}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>${order.totalPrice.toFixed(2)}</td>
                      <td>
                        {order.isPaid ? (
                          <span className='status-badge status-paid'>Paid</span>
                        ) : (
                          <span className='status-badge status-pending'>Pending</span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className='status-badge status-paid'>Delivered</span>
                        ) : (
                          <span className='status-badge status-pending'>Pending</span>
                        )}
                      </td>
                      <td>
                        <Button
                          as={Link}
                          to={`/order/${order._id}`}
                          variant='outline-primary'
                          className='btn-sm'
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
