import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import Product from '../components/Product';
import Message from '../components/Message';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import Meta from '../components/Meta';
import { motion } from 'framer-motion';
import { FaBoxes, FaTags, FaArrowRight } from 'react-icons/fa';

const HomeScreen = () => {
  const { pageNumber, keyword, category } = useParams();

  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
    category,
  });

  const activeCategory = category ? decodeURIComponent(category) : null;

  const categories = [
    'Electronics',
    'Fashion',
    'Home',
    'Sports',
    'Books',
    'Toys',
  ];

  return (
    <div className="space-y-12 pb-12">
      <Meta />
      
      {!keyword && !category && (
        <>
          {/* Figma-Inspired Soft Glow Hero Section */}
          <div className="relative rounded-3xl border border-slate-200/60 bg-gradient-to-b from-slate-50 to-white p-8 md:p-16 overflow-hidden shadow-sm dark:border-slate-800/60 dark:from-slate-900 dark:to-slate-950">
            {/* Soft Ambient Radial Lights */}
            <div className="absolute top-0 right-1/4 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-500/5" />
            <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl dark:bg-cyan-500/5" />

            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                ✨ Next-Gen Workspace Essentials
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                Curated Tech & Gear <br /> Designed For Builders.
              </h1>
              <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl font-normal leading-relaxed">
                Explore an ecosystem of premium electronics and accessories crafted to optimize performance, comfort, and workflow.
              </p>
              <div className="pt-2">
                <a
                  href="#catalog"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-md hover:bg-indigo-600 transition-all dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white"
                >
                  Browse Store Catalog <FaArrowRight className="text-xs" />
                </a>
              </div>
            </div>
          </div>

          {/* Carousel Presentation Block */}
          <div className="rounded-2xl border border-slate-100 p-4 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/20">
            <ProductCarousel />
          </div>

          {/* Premium Figma Chips Category Navigation Filter */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <FaTags /> Filter Archive
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                to="/"
                className={`h-9 inline-flex items-center justify-center rounded-xl px-4 text-xs font-medium border transition-all ${
                  !activeCategory
                    ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/category/${encodeURIComponent(cat)}`}
                  className={`h-9 inline-flex items-center justify-center rounded-xl px-4 text-xs font-medium border transition-all ${
                    activeCategory === cat
                      ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Back Button for Filter/Search states */}
      {(keyword || category) && (
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 px-4 text-xs font-semibold text-slate-600 hover:border-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white transition-all"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      )}

      {/* Primary Grid Layout */}
      <div id="catalog" className="space-y-6 scroll-mt-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FaBoxes className="text-slate-400" />
            {keyword ? 'Search Results' : category ? `${category}` : 'Featured Products'}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-2xl bg-slate-100 dark:bg-slate-900 aspect-square w-full"
              />
            ))}
          </div>
        ) : error ? (
          <Message variant="danger">
            {error?.data?.message || error.error}
          </Message>
        ) : (
          <>
            {data.products.length === 0 ? (
              <Message variant="info">No matching products found.</Message>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
            )}

            <div className="mt-12 flex justify-center">
              <Paginate
                pages={data.pages}
                page={data.page}
                keyword={keyword ? keyword : ''}
                category={category ? category : ''}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;