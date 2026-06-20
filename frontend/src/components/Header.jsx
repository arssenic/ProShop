import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const [keyword, setKeyword] = useState('');
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    /* Increased Glassmorphism Blur Engine & Softened Opacities */
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/70 backdrop-blur-lg dark:border-slate-800/60 dark:bg-slate-950/70 transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Figma Style Brand Logo */}
        <Link to="/" className="flex items-center gap-2 text-base font-bold tracking-tight text-slate-950 dark:text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white font-black text-sm shadow-md shadow-indigo-500/20">P</span>
          <span>PRO<span className="text-indigo-600 dark:text-indigo-400">SHOP</span></span>
        </Link>

        {/* Global Instant Search Bar */}
        <form onSubmit={submitHandler} className="hidden sm:flex relative max-w-md w-full mx-8">
          <input
            type="text"
            placeholder="Search catalog..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-white dark:border-slate-800 dark:bg-slate-900/50 dark:text-white dark:focus:bg-slate-950 transition-all"
          />
          <FaSearch className="absolute left-3 top-2.5 text-xs text-slate-400" />
        </form>

        {/* Action Controls Navigation */}
        <nav className="flex items-center gap-4">
          {/* Shopping Cart Trigger */}
          <Link to="/cart" className="relative flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 hover:ring-4 hover:ring-indigo-500/5 dark:hover:ring-white/5 transition-all">
            <FaShoppingCart className="text-sm text-slate-400" />
            <span className="hidden md:inline">Cart</span>
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[9px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                {cartItems.reduce((a, c) => a + c.qty, 0)}
              </span>
            )}
          </Link>

          {/* User Auth Dropdowns */}
          {userInfo ? (
            <div className="flex items-center custom-dropdown">
              <NavDropdown title={<span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{userInfo.name}</span>} id="username">
                <NavDropdown.Item as={Link} to="/profile">
                  Account Profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={logoutHandler}>
                  Log Out
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          ) : (
            <Link to="/login" className="flex h-9 items-center gap-2 rounded-xl px-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-900 transition-all">
              <FaUser className="text-sm text-slate-400" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Admin Managed Gate Dropdowns */}
          {userInfo && userInfo.isAdmin && (
            <div className="flex items-center custom-dropdown border-l border-slate-200 pl-2 dark:border-slate-800">
              <NavDropdown title={<span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">Admin</span>} id="adminmenu">
                <NavDropdown.Item as={Link} to="/admin/productlist">
                  Inventory Management
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/orderlist">
                  Order Ledgers
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/userlist">
                  User Records
                </NavDropdown.Item>
              </NavDropdown>
            </div>
          )}

          {/* High-Fidelity Light/Dark Theme Switcher Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 text-slate-500 hover:bg-slate-50 dark:border-slate-800/60 dark:text-slate-400 dark:hover:bg-slate-900 hover:ring-4 hover:ring-indigo-500/5 dark:hover:ring-white/5 transition-all"
            aria-label="Toggle structural theme"
          >
            {theme === 'light' ? <FaMoon className="text-xs" /> : <FaSun className="text-xs text-amber-400" />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;