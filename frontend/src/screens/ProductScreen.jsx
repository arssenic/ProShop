import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Image, Button, Form } from 'react-bootstrap';
import { FaTruck, FaGift, FaPercent } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
  useGetProductDetailsQuery,
  useGetProductsQuery,
  useCreateReviewMutation,
} from '../slices/productsApiSlice';
import Product from '../components/Product';
import Rating from '../components/Rating';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { addToCart } from '../slices/cartSlice';

const fallbackImage = '/images/sample.jpg';

const ProductScreen = () => {
  const { id: productId } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [giftWrap, setGiftWrap] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const increaseQty = () => {
    if (product && qty < product.countInStock) setQty(qty + 1);
  };

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const {
    data: recommendedData,
    isLoading: isRecommendedLoading,
    error: recommendedError,
  } = useGetProductsQuery(
    {
      keyword: '',
      pageNumber: 1,
      category: product?.category || '',
    },
    { skip: !product?.category }
  );

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        productId,
        rating,
        comment,
      }).unwrap();
      refetch();
      toast.success('Review created successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className='product-detail-page'>
      <Link className='btn-ghost' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <Meta title={product.name} description={product.description} />
          <div className='breadcrumb-row'>
            <Link className='breadcrumb-link' to='/'>Home</Link>
            <span className='breadcrumb-separator'>/</span>
            <span className='breadcrumb-current'>{product.name}</span>
          </div>
          <div className='product-detail-grid' style={{ alignItems: 'stretch' }}>
            <div className='product-detail-media card-system'>
              <Image
                src={product.image}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.src = fallbackImage;
                }}
                fluid
                className='product-detail-image'
              />
            </div>

            <div className='product-detail-info' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <span className='status-badge status-badge--muted'>
                  {product.brand}
                </span>
                <h1 className='product-detail-title'>{product.name}</h1>
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
              </div>

              <div className='purchase-panel card-system'>
                <div className='price-block'>
                  <span className='price-main'>Rs. {product.price.toFixed(2)}</span>
                  <p className='price-subtitle'>MRP Inclusive of all Taxes</p>
                </div>
                <div className='purchase-row'>
                  <span>Status</span>
                  <strong
                    className={
                      product.countInStock > 0
                        ? 'status-badge status-badge--success'
                        : 'status-badge status-badge--danger'
                    }
                  >
                    {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                  </strong>
                </div>
                {product.countInStock > 0 && (
                  <div className='quantity-block'>
                    <span>Quantity</span>
                    <div className='quantity-control'>
                      <button
                        type='button'
                        className='quantity-button'
                        onClick={decreaseQty}
                        disabled={qty === 1}
                      >
                        −
                      </button>
                      <span className='quantity-value'>{qty}</span>
                      <button
                        type='button'
                        className='quantity-button'
                        onClick={increaseQty}
                        disabled={qty >= product.countInStock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                <label className='gift-wrap-field'>
                  <input
                    type='checkbox'
                    checked={giftWrap}
                    onChange={(e) => setGiftWrap(e.target.checked)}
                  />
                  Free Gift Wrapping
                </label>

                <ul className='product-feature-list'>
                  <li>
                    <FaTruck className='feature-icon' /> Usually dispatched in 1-2 working days
                  </li>
                  <li>
                    <FaGift className='feature-icon' /> Free Gift Wrapping available
                  </li>
                  <li>
                    <FaPercent className='feature-icon' /> FIRST10 -10% discount on your 1st purchase.
                  </li>
                </ul>

                <div className='action-buttons'>
                  <Button
                    className='btn-system btn-large w-100'
                    type='button'
                    disabled={product.countInStock === 0}
                    onClick={addToCartHandler}
                  >
                    ADD TO CART
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <section className='product-section card-system'>
            <h2 className='section-heading'>Product Details</h2>
            <div className='detail-facts'>
              <div>
                <span>Brand</span>
                <strong>{product.brand}</strong>
              </div>
              <div>
                <span>Category</span>
                <strong>{product.category}</strong>
              </div>
              <div>
                <span>Stock</span>
                <strong>
                  {product.countInStock > 0
                    ? `${product.countInStock} available`
                    : 'Sold out'}
                </strong>
              </div>
            </div>
            <p className='product-description'>{product.description}</p>
          </section>

          {recommendedData && recommendedData.products && (
            <section className='recommended-section card-system'>
              <h2 className='section-heading'>Recommended for you</h2>
              {isRecommendedLoading ? (
                <Loader />
              ) : recommendedError ? (
                <Message variant='danger'>
                  {recommendedError?.data?.message || recommendedError.error}
                </Message>
              ) : (
                <div className='product-grid'>
                  {recommendedData.products
                    .filter((item) => item._id !== product._id)
                    .slice(0, 4)
                    .map((item) => (
                      <Product key={item._id} product={item} />
                    ))}
                </div>
              )}
            </section>
          )}

          <section className='reviews-section'>
            <h2 className='section-heading'>Reviews</h2>
            <div className='reviews-stack'>
              <div className='card-system'>
                {product.reviews.length === 0 && <Message>No Reviews</Message>}
                {product.reviews.map((review) => (
                  <div className='review-item' key={review._id}>
                    <div className='review-item__header'>
                      <strong>{review.name}</strong>
                      <span>{review.createdAt.substring(0, 10)}</span>
                    </div>
                    <Rating value={review.rating} />
                    <p>{review.comment}</p>
                  </div>
                ))}
              </div>

              <div className='card-system'>
                <h2 className='section-heading'>Write a Customer Review</h2>

                {loadingProductReview && <Loader />}

                {userInfo ? (
                  <Form onSubmit={submitHandler} className='review-form'>
                    <Form.Group controlId='rating'>
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as='select'
                        required
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value=''>Select...</option>
                        <option value='1'>1 - Poor</option>
                        <option value='2'>2 - Fair</option>
                        <option value='3'>3 - Good</option>
                        <option value='4'>4 - Very Good</option>
                        <option value='5'>5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>
                    <Form.Group controlId='comment'>
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as='textarea'
                        rows='3'
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>
                    <Button
                      disabled={loadingProductReview}
                      type='submit'
                      className='btn-system'
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message>
                    Please <Link to='/login'>sign in</Link> to write a review
                  </Message>
                )}
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default ProductScreen;
