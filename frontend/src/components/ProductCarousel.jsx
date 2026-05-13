import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Message from './Message';
import { useGetTopProductsQuery } from '../slices/productsApiSlice';

const fallbackImage = '/images/sample.jpg';

const ProductCarousel = () => {
  const { data: products, isLoading, error } = useGetTopProductsQuery();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? products.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  if (isLoading) return null;
  if (error) return <Message variant='danger'>{error?.data?.message || error.error}</Message>;
  if (!products || products.length === 0) return null;

  const currentProduct = products[currentIndex];

  return (
    <div className='relative w-full h-96 mb-8 rounded-lg overflow-hidden bg-gray-100 dark:bg-dark-800'>
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className='absolute inset-0'
        >
          <Link to={`/product/${currentProduct._id}`} className='block h-full'>
            <img
              src={currentProduct.image}
              alt={currentProduct.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImage;
              }}
              className='w-full h-full object-contain bg-white p-8'
            />
            {}
            <h2 className='absolute top-6 left-8 z-20 text-xl md:text-2xl font-bold leading-tight break-words text-black max-w-[500px]'>
              {currentProduct.name}
            </h2>

            <div className='absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-transparent flex items-end'>
              <div className='p-6 md:p-8 text-white w-full max-w-[45%] z-10'>

                <p className='text-lg md:text-2xl font-semibold'>
                  ${currentProduct.price}
                </p>

                <span className='inline-block mt-4 px-5 py-2 bg-white text-blue-700 rounded-lg font-bold text-sm md:text-base'>
                  Shop Now
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className='absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-dark-700 text-blue-600 dark:text-blue-400 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors z-10'
        aria-label='Previous product'
      >
        <FaChevronLeft className='text-xl' />
      </button>

      <button
        onClick={goToNext}
        className='absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-dark-700 text-blue-600 dark:text-blue-400 p-3 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors z-10'
        aria-label='Next product'
      >
        <FaChevronRight className='text-xl' />
      </button>

      {/* Dot Indicators */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10'>
        {products.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
