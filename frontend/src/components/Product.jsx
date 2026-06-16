import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaShoppingCart, FaHeart, FaRegHeart, FaStar } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';

const fallbackImage = '/images/sample.jpg';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('proshopWishlist') || '[]');
    setIsWishlisted(savedWishlist.includes(product._id));
  }, [product._id]);

  const toggleWishlist = () => {
    const savedWishlist = JSON.parse(localStorage.getItem('proshopWishlist') || '[]');
    const updated = savedWishlist.includes(product._id)
      ? savedWishlist.filter((id) => id !== product._id)
      : [...savedWishlist, product._id];

    localStorage.setItem('proshopWishlist', JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
  };

  const addToCartHandler = () => {
    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      setIsAdding(true);
      setTimeout(() => setIsAdding(false), 800);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/60 bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0,04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0,08)] dark:border-slate-800/60 dark:bg-slate-900">
      
      {/* Figma Inner Frame Viewport */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-50 dark:bg-slate-950">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className="h-full w-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Heart Icon */}
        <button
          type="button"
          onClick={toggleWishlist}
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-700 backdrop-blur-md transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95 dark:bg-slate-900/80 dark:text-slate-300"
          aria-label="Wishlist toggle"
        >
          {isWishlisted ? <FaHeart className="text-rose-500" /> : <FaRegHeart className="hover:text-rose-500" />}
        </button>

        {/* Stock Status Pill */}
        {product.countInStock === 0 && (
          <span className="absolute bottom-3 left-3 rounded-md bg-slate-900/80 px-2 py-1 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
            Out of Stock
          </span>
        )}
      </div>

      {/* Content Meta Wrapper */}
      <div className="mt-4 flex flex-col flex-grow">
        {/* Rating Ribbon */}
        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
          <FaStar className="scale-90" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal dark:text-slate-500">({product.numReviews})</span>
        </div>

        <Link
          to={`/product/${product._id}`}
          className="mt-1.5 text-sm font-semibold tracking-tight text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 line-clamp-2 min-h-[40px]"
        >
          {product.name}
        </Link>

        {/* Bottom Interactive Row */}
        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">Price</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <button
            type="button"
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
            className={`flex h-9 items-center justify-center gap-2 rounded-xl px-4 text-xs font-semibold transition-all duration-200 ${
              isAdding
                ? 'bg-emerald-600 text-white shadow-emerald-900/20'
                : 'bg-slate-900 text-white hover:bg-indigo-600 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white'
            } disabled:opacity-40 disabled:pointer-events-none shadow-sm`}
          >
            <FaShoppingCart className={isAdding ? 'animate-bounce' : ''} />
            {isAdding ? 'Added' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;