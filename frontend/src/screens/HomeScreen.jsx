import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { motion, AnimatePresence } from 'framer-motion';
import {FaShoppingBag,FaShippingFast,FaLock,FaHeadset,FaBoxes,FaTags,FaArrowRight,FaSearchMinus,FaSlidersH,FaSortAmountDown,FaEyeSlash} from 'react-icons/fa';
import { toast } from 'react-toastify';

const HomeScreen = () => {
  const { pageNumber, keyword, category } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
  });

  const activeCategory = category ? decodeURIComponent(category) : null;

  // Real-Time E-Commerce Filtering States
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Automatically recalibrate price ceiling slider boundaries based on fetched inventory data
  useEffect(() => {
    if (data && data.products && data.products.length > 0) {
      const highestPrice = Math.max(...data.products.map((p) => p.price));
      setMaxPrice(Math.ceil(highestPrice));
    }
  }, [data]);

  // Reset local interactive filter constraints when global scopes change
  useEffect(() => {
    setInStockOnly(false);
    setSortBy('featured');
    setMaxPrice(1000);
  }, [keyword, category]);

  const getTimeLeft = (endDate) => {
    const total = Math.max(0, endDate - new Date());
    const hours = String(Math.floor(total / (1000 * 60 * 60))).padStart(2, '0');
    const minutes = String(Math.floor((total % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
    const seconds = String(Math.floor((total % (1000 * 60)) / 1000)).padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const [dealEndDate] = useState(() => {
    const date = new Date();
    date.setHours(date.getHours() + 8);
    return date;
  });

  const [dealTimeLeft, setDealTimeLeft] = useState(() => getTimeLeft(dealEndDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setDealTimeLeft(getTimeLeft(dealEndDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [dealEndDate]);

  const categories = [
    { name: 'Electronics', icon: '💻' },
    { name: 'Fashion', icon: '👕' },
    { name: 'Home', icon: '🏠' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Books', icon: '📚' },
    { name: 'Toys', icon: '🧸' },
  ];

  const newsletterSubmitHandler = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      toast.error('Please enter a valid transmission email address.');
      return;
    }
    toast.success('Successfully connected! Welcome to the ProShop pipeline drop.');
    setNewsletterEmail('');
  };

  // Processing Layer: Client-Side Structural Filtering & Sorting Array pipelines
  let filteredProducts = data?.products ? [...data.products] : [];

  if (filteredProducts.length > 0) {
    // 1. Stock Status Constraint
    if (inStockOnly) {
      filteredProducts = filteredProducts.filter((p) => p.countInStock > 0);
    }
    // 2. Continuous Floating Price Cap
    filteredProducts = filteredProducts.filter((p) => p.price <= maxPrice);

    // 3. Multi-Criteria Evaluation Sort Engine
    if (sortBy === 'price-low') {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filteredProducts.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filteredProducts.sort((a, b) => b.rating - a.rating);
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-12">
      <Meta />

      {!keyword && !category && (
        <>
          {/* Figma-Inspired Soft Glow Hero Section */}
          <motion.section
            className="relative rounded-3xl border border-slate-200/60 bg-gradient-to-b from-slate-50 to-white p-8 md:p-16 overflow-hidden shadow-sm dark:border-slate-800/60 dark:from-slate-900 dark:to-slate-950"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/5 pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5 pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                ✨ Next-Gen Workspace Essentials
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Curated Tech & Gear <br /> Designed For Builders.
              </h1>
              <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl font-normal leading-relaxed">
                Discover amazing products at unbeatable prices, handpicked for your next purchase layout optimization.
              </p>
              <div className="pt-2">
                <a
                  href="#catalog"
                  className="premium-btn-primary h-11 px-6 text-sm"
                >
                  Browse Store Catalog &nbsp; &rarr;
                </a>
              </div>
            </div>
          </motion.section>

          {/* Carousel Presentation Block */}
          <section className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
            <ProductCarousel />
          </section>

          {/* Features Dashboard Section */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="premium-card text-center flex flex-col items-center justify-center p-6 border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <FaShippingFast className="text-slate-950 dark:text-white text-xl mb-3" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Fast Shipping</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Quick delivery to your doorstep</p>
              </div>

              <div className="premium-card text-center flex flex-col items-center justify-center p-6 border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <FaLock className="text-slate-950 dark:text-white text-xl mb-3" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Secure Payment</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">100% safe transactions</p>
              </div>

              <div className="premium-card text-center flex flex-col items-center justify-center p-6 border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <FaShoppingBag className="text-slate-950 dark:text-white text-xl mb-3" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">Wide Selection</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Thousands of options available</p>
              </div>

              <div className="premium-card text-center flex flex-col items-center justify-center p-6 border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
                <FaHeadset className="text-slate-950 dark:text-white text-xl mb-3" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white mb-1">24/7 Support</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Constant operational coverage</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Navigation Return Button for Query states */}
      {(keyword || category) && (
        <div>
          <Link
            to="/"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:border-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white transition-all"
          >
            &larr; Back to Catalog Dashboard
          </Link>
        </div>
      )}

      {/* Asymmetric Split Layout Frame (From image_ed05e4.jpg) */}
      <div id="catalog" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start scroll-mt-24">
        
        {/* LEFT PANEL: Interactive Filter Controls Sidebar Stack */}
        <aside className="hidden lg:block lg:col-span-3 space-y-7 sticky top-24 border-r border-slate-200/60 pr-6 dark:border-slate-800/60">
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <FaSlidersH /> Navigation Index
            </h3>
            
            <div className="flex flex-col space-y-1">
              <Link
                to="/"
                className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                  !activeCategory
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
                }`}
              >
                <span>○</span> All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className={`flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${
                    activeCategory === cat.name
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* FULLY OPERATIONAL Price Constraint Filter Slider */}
          <div className="space-y-4 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Max Price Cap</h4>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">${maxPrice}</span>
            </div>
            <div className="space-y-2 px-1">
              <input
                type="range"
                min="10"
                max={data?.products?.length ? Math.ceil(Math.max(...data.products.map(p => p.price), 100)) : 1000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-800"
              />
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>$10</span>
                <span>Max Ceiling</span>
              </div>
            </div>
          </div>

          {/* E-Commerce Structural Feature: Inventory Status Toggle */}
          <div className="space-y-3 pt-4 border-t border-slate-200/60 dark:border-slate-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Availability Status</h4>
            <label className="relative inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-xs font-semibold text-slate-600 dark:text-slate-400">In-Stock Only</span>
            </label>
          </div>
        </aside>

        {/* RIGHT PANEL: Dynamic Core Product Grid Architecture */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Top Row Context Bar: Contains Page Headers and Sorting Selectors */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              <FaBoxes className="text-slate-400" />
              {keyword ? 'Search Ledger' : activeCategory ? `${activeCategory}` : 'Catalog Releases'}
            </h2>

            {/* FULLY FUNCTIONAL Product Sorter Component */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <FaSortAmountDown className="text-xs text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
              >
                <option value="featured">Sort By: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Horizontal Chips Row - Scaled up based on your request */}
          {!keyword && (
            <div className="flex flex-row overflow-x-auto gap-3 pb-2 scrollbar-none lg:hidden">
              <Link
                to="/"
                className={`h-12 inline-flex items-center justify-center rounded-2xl px-6 text-sm font-bold tracking-wide border transition-all ${
                  !activeCategory
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-white border-slate-200/80 text-slate-600 dark:bg-slate-900 dark:border-slate-800'
                }`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  to={`/category/${encodeURIComponent(cat.name)}`}
                  className={`h-12 inline-flex items-center justify-center rounded-2xl px-6 text-sm font-bold tracking-wide border transition-all ${
                    activeCategory === cat.name
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'bg-white border-slate-200/80 text-slate-600 dark:bg-slate-900 dark:border-slate-800'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse space-y-3">
                  <div className="bg-slate-100 dark:bg-slate-900 aspect-square w-full rounded-2xl" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Message variant="danger">
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="space-y-10">
              <AnimatePresence mode="wait">
                {filteredProducts.length === 0 ? (
                  /* High-Fidelity Empty State Placeholder Viewport */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="flex flex-col items-center justify-center text-center py-24 px-4 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/20"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white dark:bg-slate-900 shadow-sm text-slate-400 mb-4">
                      <FaSearchMinus className="text-lg" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      No Products Found Within Range
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-xs font-light leading-relaxed">
                      Sorry, no items match your price constraints or availability options. Try modifying your filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setInStockOnly(false);
                        setSortBy('featured');
                        setMaxPrice(1000);
                      }}
                      className="mt-6 h-9 inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-indigo-600 transition-all dark:bg-white dark:text-slate-900"
                    >
                      Reset All Filters
                    </button>
                  </motion.div>
                ) : (
                  /* Floating Asymmetric Grid Layout */
                  <motion.div
                    key="grid"
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {filteredProducts.map((product) => (
                      <motion.div key={product._id} variants={itemVariants} layout>
                        <Product product={product} />
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-12 pt-4 border-t border-slate-100 dark:border-slate-900 flex justify-center">
                <Paginate
                  pages={data.pages}
                  page={data.page}
                  keyword={keyword ? keyword : ''}
                  category={category ? category : ''}
                />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Interactive Countdown / Hot Offers Strip */}
      {!keyword && !category && (
        <section className="premium-card bg-gradient-to-r from-orange-50 via-white to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 border-orange-100 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-400">⚡ Limited Structural Deal</p>
              <h2 className="mt-1 text-base font-bold text-slate-900 dark:text-white">Limited time savings on top tier releases</h2>
            </div>
            <div className="font-mono text-sm font-bold tracking-wider rounded-xl border border-orange-200 bg-orange-50/50 px-4 py-2 text-orange-700 dark:border-slate-800 dark:bg-slate-950 dark:text-orange-400 self-start sm:self-auto">
              ⏰ {dealTimeLeft.hours}:{dealTimeLeft.minutes}:{dealTimeLeft.seconds}
            </div>
          </div>
        </section>
      )}

      {/* Functional Newsletter Component Block */}
      <section className="bg-slate-950 dark:bg-slate-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
        <div className="absolute -right-16 -bottom-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2 items-center relative z-10">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-indigo-400 uppercase">Newsletter Drop</p>
            <h3 className="mt-1 text-xl font-bold uppercase tracking-tight leading-tight">
              Subscribe for prioritized updates and stock availability notifications.
            </h3>
          </div>

          <form className="flex flex-col sm:flex-row gap-3" onSubmit={newsletterSubmitHandler}>
            <input
              type="email"
              placeholder="Enter your email address"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
           <button
              type="submit"
              className="bg-white text-slate-950 font-bold text-xs uppercase tracking-widest h-10 rounded-xl px-6 whitespace-nowrap hover:bg-white hover:text-indigo-600 transition-all duration-200 active:scale-95"
            >
              Join the Community
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;