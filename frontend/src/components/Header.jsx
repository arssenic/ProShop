import { useState, useEffect, useRef } from 'react';
import { FaShoppingCart, FaUser, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';
import { useTheme } from '../context/ThemeContext';
import SearchBox from './SearchBox';
import logo from '../assets/logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isBump, setIsBump] = useState(false);
  const firstRenderRef = useRef(true);

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const cartCount = cartItems.reduce((a, c) => a + c.qty, 0);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }

    if (cartCount === 0) return;

    setIsBump(true);
    const timer = setTimeout(() => setIsBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <header className='sticky top-0 z-50 backdrop-blur-[12px] bg-white/80 dark:bg-slate-950/80 border-b border-slate-200/70 dark:border-slate-800 shadow-sm'>
      <nav className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link
            to='/'
            className='flex items-center space-x-2 text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity'
          >
            <img src={logo} alt='Proshop' className='h-8 w-8' />
            <span>Proshop</span>
          </Link>

          <div className='hidden lg:flex items-center space-x-8'>
            <SearchBox />

            <Link
              to='/cart'
              className='relative flex items-center space-x-1 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors'
            >
              <FaShoppingCart className='text-xl' />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className={`absolute -top-2 -right-3 bg-[#d97706] text-white text-[11px] font-bold rounded-full h-5 w-5 flex items-center justify-center ${isBump ? 'animate-cart-bump' : ''}`}>
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className='relative'>
                <button
                  onClick={() => setIsUserOpen(!isUserOpen)}
                  className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
                >
                  <FaUser />
                  <span>{userInfo.name}</span>
                </button>
                {isUserOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600'>
                    <Link
                      to='/profile'
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors'
                      onClick={() => setIsUserOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logoutHandler}
                      className='w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors border-t border-gray-200 dark:border-gray-600'
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to='/login'
                className='flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors'
              >
                <FaUser />
                <span>Sign In</span>
              </Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <div className='relative'>
                <button
                  onClick={() => setIsAdminOpen(!isAdminOpen)}
                  className='px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                >
                  Admin
                </button>
                {isAdminOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-dark-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600'>
                    <Link
                      to='/admin/productlist'
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors'
                      onClick={() => setIsAdminOpen(false)}
                    >
                      Products
                    </Link>
                    <Link
                      to='/admin/orderlist'
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors'
                      onClick={() => setIsAdminOpen(false)}
                    >
                      Orders
                    </Link>
                    <Link
                      to='/admin/userlist'
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors'
                      onClick={() => setIsAdminOpen(false)}
                    >
                      Users
                    </Link>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-dark-600 transition-colors'
              aria-label='Toggle theme'
            >
              {isDark ? <FaSun className='text-yellow-400' /> : <FaMoon className='text-gray-500' />}
            </button>
          </div>

          <div className='lg:hidden flex items-center space-x-4'>
            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-300'
              aria-label='Toggle theme'
            >
              {isDark ? <FaSun className='text-yellow-400' /> : <FaMoon className='text-gray-500' />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className='p-2 text-gray-700 dark:text-gray-300'
            >
              {isOpen ? <FaTimes className='text-2xl' /> : <FaBars className='text-2xl' />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className='lg:hidden pb-4 space-y-4'>
            <SearchBox />

            <Link
              to='/cart'
              className='flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
              onClick={() => setIsOpen(false)}
            >
              <FaShoppingCart />
              <span>Cart {cartCount > 0 && `(${cartCount})`}</span>
            </Link>

            {userInfo ? (
              <>
                <Link
                  to='/profile'
                  className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={logoutHandler}
                  className='block w-full text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to='/login'
                className='flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
                onClick={() => setIsOpen(false)}
              >
                <FaUser />
                <span>Sign In</span>
              </Link>
            )}

            {userInfo && userInfo.isAdmin && (
              <>
                <hr className='dark:border-gray-700' />
                <div className='pt-2 space-y-2'>
                  <Link
                    to='/admin/productlist'
                    className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Products
                  </Link>
                  <Link
                    to='/admin/orderlist'
                    className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Orders
                  </Link>
                  <Link
                    to='/admin/userlist'
                    className='block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-2'
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Users
                  </Link>
                </div>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
