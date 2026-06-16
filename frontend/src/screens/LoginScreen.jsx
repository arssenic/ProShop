import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import Message from '../components/Message';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading, error }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate(redirect);
    } catch (err) {
      // Handled gracefully by the RTK Query error state
    }
  };

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8 overflow-hidden">
      {/* Figma Ambient Glow Accents */}
      <div className="absolute top-1/4 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none dark:bg-indigo-500/5" />
      
      <div className="premium-card w-full max-w-md space-y-6 border border-slate-200/60 dark:border-slate-800/60">
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
            <FaSignInAlt className="text-sm" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Enter your credentials to access your ProShop terminal
          </p>
        </div>

        {/* Dynamic Warning Messages */}
        {error && <Message variant="danger">{error?.data?.message || error.error}</Message>}

        {/* Auth Input Fields */}
        <form onSubmit={submitHandler} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Email Address
            </label>
            <div className="relative flex items-center">
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="premium-input !pl-12"
              />
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative flex items-center">
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="premium-input !pl-12"
              />
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Action Confirmation Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="premium-btn-primary w-full mt-2 h-11"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Authenticating...
              </span>
            ) : (
              'Sign In to Account'
            )}
          </button>
        </form>

        {/* Clean Secondary Redirection Footer */}
        <div className="border-t border-slate-100 pt-4 text-center text-xs dark:border-slate-800/60">
          <span className="text-slate-400 dark:text-slate-500">New around here?</span>{' '}
          <Link
            to={redirect ? `/register?redirect=${redirect}` : '/register'}
            className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;