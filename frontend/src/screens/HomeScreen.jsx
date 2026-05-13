import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { motion } from 'framer-motion';
import {
  FaShoppingBag,
  FaShippingFast,
  FaLock,
  FaHeadset,
} from 'react-icons/fa';

const HomeScreen = () => {
  const { pageNumber, keyword, category } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
  });

  const activeCategory = category ? decodeURIComponent(category) : null;

  // Define getTimeLeft before using it in useState
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
    'Electronics',
    'Fashion',
    'Home',
    'Sports',
    'Books',
    'Toys',
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <Meta />
      {!keyword && !category && (
        <>
          {}
          <motion.section
            className='home-hero relative w-full h-[320px] mb-12 overflow-hidden rounded-[32px] shadow-2xl'
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
          >
            <div className='absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e3a8a_60%,#312e81_100%)]' />
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_76%_18%,rgba(124,58,237,0.18),transparent_22%),radial-gradient(circle_at_30%_82%,rgba(29,78,216,0.14),transparent_18%)] opacity-90' />
            <div className='absolute top-6 left-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white inline-flex items-center gap-2 backdrop-blur-md z-20'>
              <span className='h-2.5 w-2.5 rounded-full bg-cyan-300 animate-pulse' />
              Exclusive launch bundle
            </div>

            <motion.div
              className='relative z-10 flex h-full flex-col items-center justify-center text-center px-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1 }}
            >
              <h1 className='text-3xl md:text-5xl font-bold leading-tight mb-4 text-white'>
                Welcome to Shopify
              </h1>

              <p className='text-sm md:text-base max-w-2xl mb-7 text-slate-100/85'>
                Discover amazing products at unbeatable prices, handpicked for your next purchase.
              </p>

              <div className='flex justify-center'>
                <motion.a
                  href='#products'
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className='btn-system btn-large bg-gradient-to-r from-[#1d4ed8] to-[#7c3aed] text-white shadow-lg shadow-indigo-500/20'
                >
                  Shop Now
                </motion.a>
              </div>
            </motion.div>
          </motion.section>

          {/* Featured Products Carousel */}
          <section className='mb-12'>
            <ProductCarousel />
          </section>

          {/* Features Section */}
          <section className='mb-12 py-8'>
            <motion.div
              className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
            >
              <motion.div
                variants={itemVariants}
                className='card p-6 text-center'
              >
                <FaShippingFast className='text-4xl text-blue-600 dark:text-blue-400 mx-auto mb-4' />
                <h3 className='text-lg font-bold mb-2'>Fast Shipping</h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Quick delivery to your doorstep
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='card p-6 text-center'
              >
                <FaLock className='text-4xl text-blue-600 dark:text-blue-400 mx-auto mb-4' />
                <h3 className='text-lg font-bold mb-2'>Secure Payment</h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  100% safe transactions
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='card p-6 text-center'
              >
                <FaShoppingBag className='text-4xl text-blue-600 dark:text-blue-400 mx-auto mb-4' />
                <h3 className='text-lg font-bold mb-2'>Wide Selection</h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Thousands of products
                </p>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className='card p-6 text-center'
              >
                <FaHeadset className='text-4xl text-blue-600 dark:text-blue-400 mx-auto mb-4' />
                <h3 className='text-lg font-bold mb-2'>24/7 Support</h3>
                <p className='text-gray-600 dark:text-gray-400 text-sm'>
                  Always here to help
                </p>
              </motion.div>
            </motion.div>
          </section>

          {/* Category Section Placeholder */}
          <section id='categories' className='mb-12'>
            <h2 className='text-3xl font-bold mb-8 text-slate-900 dark:text-slate-100'>Shop by Category</h2>
            <motion.div
              className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'
              variants={containerVariants}
              initial='hidden'
              whileInView='visible'
              viewport={{ once: true }}
            >
              {categories.map((categoryName) => (
                <motion.div
                  key={categoryName}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link
                    to={`/category/${encodeURIComponent(categoryName)}`}
                    className={`category-pill flex items-center justify-center w-30 h-30 text-center transition-all duration-300 rounded-full ${
                      activeCategory === categoryName ? 'category-pill--active' : ''
                    }`}
                  >
                    <span className='text-xl font-semibold'>
                      {categoryName}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </section>

          <section className='deal-banner mb-12 rounded-[24px] border border-orange-300/20 bg-gradient-to-r from-orange-100 via-orange-50 to-white p-6 shadow-lg shadow-orange-200/20 dark:border-orange-500/20 dark:bg-slate-900/80 dark:from-slate-950/80 dark:to-slate-900/70'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.24em] text-orange-700 dark:text-orange-300'>Deal of the Day</p>
                <h2 className='mt-2 text-xl font-extrabold text-slate-900 dark:text-white'>Limited time savings on top picks</h2>
              </div>
              <div className='inline-flex items-center gap-4 rounded-full border border-orange-200 bg-white/90 px-5 py-3 text-sm font-medium text-orange-700 shadow-sm dark:border-orange-500/20 dark:bg-slate-950/80 dark:text-orange-300'>
                <span className='inline-flex h-9 w-9 items-center justify-center rounded-full bg-orange-500 text-white'>⏰</span>
                <span>{dealTimeLeft.hours}:{dealTimeLeft.minutes}:{dealTimeLeft.seconds}</span>
              </div>
            </div>
          </section>
        </>
      )}

      {(keyword || category) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='mb-6'
        >
          <Link
            to='/'
            className='inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
          >
            &larr; Go Back
          </Link>
        </motion.div>
      )}

      {/* Latest Products Section */}
<section id='products' className='products-section'>
  <h2 className='section-heading'>
    {keyword
      ? 'Search Results'
      : category
        ? `${category} Products`
        : 'Latest Products'}
  </h2>

  {isLoading ? (
    <div className='product-grid'>
      {[...Array(8)].map((_, index) => (
        <div
          key={index}
          className='skeleton-card rounded-[22px] bg-slate-200/80 dark:bg-slate-700 h-[420px]'
        />
      ))}
    </div>
  ) : error ? (
    <Message variant='danger'>
      {error?.data?.message || error.error}
    </Message>
  ) : (
    <>
      <motion.div
        className='product-grid'
        variants={containerVariants}
        initial='hidden'
        whileInView='visible'
        viewport={{ once: true }}
      >
        {data.products.map((product) => (
          <motion.div key={product._id} variants={itemVariants}>
            <Product product={product} />
          </motion.div>
        ))}
      </motion.div>

      <div className='mt-12'>
        <Paginate
          pages={data.pages}
          page={data.page}
          keyword={keyword ? keyword : ''}
          category={category ? category : ''}
        />
      </div>
    </>
  )}
</section>

<section className='newsletter-strip mt-16 mb-12 rounded-[28px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-700 p-8 md:p-12 text-white shadow-2xl'>
  <div className='max-w-6xl mx-auto grid gap-8 md:grid-cols-[1fr_auto] items-center'>
    <div>
      <p className='text-sm uppercase tracking-[0.24em] text-slate-300'>
        Join our newsletter
      </p>

      <h3 className='mt-3 text-xl md:text-2xl font-bold text-white leading-tight'>
        Get exclusive drops and early access offers
      </h3>
    </div>

    <form className='flex flex-col sm:flex-row gap-4 sm:items-center'>
      <input
        type='email'
        placeholder='Enter your email'
        className='w-full sm:w-[320px] rounded-full border border-slate-600 bg-slate-950/90 py-2 px-6 text-white placeholder:text-slate-400 outline-none transition duration-200 focus:border-indigo-500'
      />

      <button
        type='submit'
        className='rounded-full bg-[#2563eb] px-8 py-2 text-white font-semibold hover:bg-[#1d4ed8] transition-all duration-300'
      >
        Subscribe
      </button>
    </form>

  </div>
</section>
    </>
  );
};

export default HomeScreen;
