import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaShoppingCart, FaStar } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';

const fallbackImage = '/images/sample.jpg';

const Product = ({ product }) => {
  const dispatch = useDispatch();

  const addToCartHandler = () => {
    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
    }
  };

  // Asymmetric badge generator matching image_ed05e4.jpg
  const getBadge = () => {
    if (product.rating >= 4.5) {
      return { text: 'Hot!', styles: 'bg-purple-800 text-white' };
    }
    if (product.countInStock === 0) {
      return { text: 'Sold Out', styles: 'bg-slate-500 text-white' };
    }
    if (product.price < 50) {
      return { text: 'Sale', styles: 'bg-emerald-600 text-white' };
    }
    return null;
  };

  const badge = getBadge();

  return (
    <article className="group flex flex-col justify-between bg-transparent transition-all duration-300">
      
      {/* Upper Compartment: Light Geometric Image Window */}
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f6f6f6] dark:bg-slate-900 transition-colors duration-300">
        <Link to={`/product/${product._id}`} className="block h-full w-full">
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className="h-full w-full object-contain p-6 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 ease-out group-hover:scale-102"
          />
        </Link>

        {/* Diagonal Corner Badge Ribbon from image_ed05e4.jpg */}
        {badge && (
          <div className={`absolute top-0 left-0 overflow-hidden w-16 h-16 pointer-events-none`}>
            <div className={`absolute top-2 -left-6 w-20 text-center rotate-45 text-[9px] font-bold uppercase tracking-wider py-0.5 shadow-sm ${badge.styles}`}>
              {badge.text}
            </div>
          </div>
        )}
        
        {/* Minimal Add-to-Cart Circular overlay trigger */}
        {product.countInStock > 0 && (
          <button
            type="button"
            onClick={addToCartHandler}
            className="absolute bottom-3 right-3 hidden group-hover:flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white shadow-md hover:bg-indigo-600 dark:bg-white dark:text-slate-900 dark:hover:bg-indigo-500 dark:hover:text-white transition-all duration-200"
            aria-label="Quick Add to Cart"
          >
            <FaShoppingCart className="text-xs" />
          </button>
        )}
      </div>

      {/* Lower Compartment: Floating Details Area (No Outer Card Wrappers) */}
      <div className="mt-3 flex flex-col text-left space-y-1">
        <Link
          to={`/product/${product._id}`}
          className="text-sm font-medium tracking-tight text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-500">
          <FaStar className="scale-90" />
          <span>{product.rating.toFixed(1)}</span>
          <span className="text-slate-400 font-normal">({product.numReviews})</span>
        </div>

        <span className="text-base font-bold text-slate-900 dark:text-white pt-0.5">
          ${product.price.toFixed(2)}
        </span>
      </div>
    </article>
  );
};

export default Product;