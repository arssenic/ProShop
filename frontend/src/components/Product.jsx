import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { FaShoppingCart, FaHeart, FaRegHeart } from 'react-icons/fa';
import { addToCart } from '../slices/cartSlice';
import Rating from './Rating';

const fallbackImage = '/images/sample.jpg';

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem('shopifyWishlist') || '[]');
    setIsWishlisted(savedWishlist.includes(product._id));
  }, [product._id]);

  const toggleWishlist = () => {
    const savedWishlist = JSON.parse(localStorage.getItem('shopifyWishlist') || '[]');
    const updated = savedWishlist.includes(product._id)
      ? savedWishlist.filter((id) => id !== product._id)
      : [...savedWishlist, product._id];

    localStorage.setItem('shopifyWishlist', JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
  };

  const addToCartHandler = () => {
    if (product.countInStock > 0) {
      dispatch(addToCart({ ...product, qty: 1 }));
      setButtonClicked(true);
      setTimeout(() => setButtonClicked(false), 500);
    }
  };

  const badgeLabel = product.isHot
    ? 'Hot'
    : product.isNew
    ? 'New'
    : product.salePrice
    ? 'Sale'
    : null;

  return (
    <article className='product-card'>
      <div className='product-card__media'>
        <Link to={`/product/${product._id}`} className='product-card__image-link'>
          <img
            src={product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            className='product-card__image'
          />
          <div className='quick-view-overlay'>
            <span>Quick View</span>
          </div>
        </Link>

        <button
          type='button'
          className={`wishlist-button ${isWishlisted ? 'wishlisted' : ''}`}
          onClick={toggleWishlist}
          aria-label='Add to wishlist'
        >
          {isWishlisted ? <FaHeart /> : <FaRegHeart />}
        </button>

        {badgeLabel && (
          <span className='product-badge'>{badgeLabel}</span>
        )}
      </div>

      <div className='product-card__body'>
        <Link
          to={`/product/${product._id}`}
          className='product-card__title'
        >
          {product.name}
        </Link>

        <Rating value={product.rating} text={`${product.numReviews} reviews`} />

        {product.countInStock > 0 && product.countInStock < 5 && (
          <div className='stock-warning'>Only {product.countInStock} left!</div>
        )}

        <div className='product-card__footer'>
          <span className='product-card__price'>${product.price}</span>
          <button
            type='button'
            className={`btn-system product-card__button ${buttonClicked ? 'btn-confirm' : ''}`}
            disabled={product.countInStock === 0}
            onClick={addToCartHandler}
          >
            <FaShoppingCart />
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default Product;
