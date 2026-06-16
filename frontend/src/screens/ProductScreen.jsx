import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import Rating from '../components/Rating';
import Message from '../components/Message';
import Meta from '../components/Meta';
import { FaBoxOpen, FaCheckCircle, FaExclamationTriangle, FaPen, FaCommentDots } from 'react-icons/fa';

const ProductScreen = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { data: product, isLoading, refetch, error } = useGetProductDetailsQuery(productId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const reviewSubmitHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Please select a structural rating metric.');
      return;
    }
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      toast.success('Review verified and submitted successfully.');
      setRating(0);
      setComment('');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="space-y-8 py-4">
      <Meta title={product?.name} />
      <div>
        <Link to="/" className="premium-btn-secondary h-9 px-4">&larr; Return to Catalog</Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-900 w-full" />
        </div>
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side Viewport Media Window */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-200/60 bg-white p-6 dark:border-slate-800/60 dark:bg-slate-900 sticky top-24">
            <div className="aspect-square rounded-xl bg-slate-50 p-8 dark:bg-slate-950 flex items-center justify-center">
              <img src={product.image} alt={product.name} className="max-h-[440px] object-contain object-center mix-blend-multiply dark:mix-blend-normal" />
            </div>
          </div>

          {/* Right Side Control Panel Stack - Fills empty vertical space */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{product.name}</h1>
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <Rating value={product.rating} text="" />
                <span className="text-xs font-semibold text-slate-400">{product.numReviews} verifiable reviews</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 font-light">{product.description}</p>

            {/* Price & Quantity Purchase Matrix card */}
            <div className="premium-card space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Unit Price</span>
                <span className="text-2xl font-black text-slate-900 dark:text-white">${product.price.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">Inventory Status</span>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${product.countInStock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {product.countInStock > 0 ? <><FaCheckCircle /> Ready for Deployment</> : <><FaExclamationTriangle /> Allocated</>}
                </span>
              </div>

              {product.countInStock > 0 && (
                <div className="flex items-center justify-between">
                  <label htmlFor="qty-select" className="text-xs uppercase tracking-wider font-semibold text-slate-400">Select Quantity</label>
                  <select id="qty-select" value={qty} onChange={(e) => setQty(Number(e.target.value))} className="premium-input max-w-[100px] h-9 py-0">
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>{x + 1}</option>
                    ))}
                  </select>
                </div>
              )}

              <button type="button" disabled={product.countInStock === 0} onClick={addToCartHandler} className="premium-btn-primary w-full mt-2">
                <FaBoxOpen /> {product.countInStock > 0 ? 'Add to Cart' : 'Stock Allocated'}
              </button>
            </div>

            {/* Section Just Down to Add to Cart: Write a Review Form */}
            <div className="premium-card space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                <FaPen /> Append Customer Review
              </h3>
              
              {loadingProductReview && <div className="h-1 w-full bg-indigo-100 animate-pulse rounded" />}
              
              {userInfo ? (
                <form onSubmit={reviewSubmitHandler} className="space-y-3">
                  <div className="space-y-1">
                    <label htmlFor="rating" className="text-xs font-medium text-slate-500">Rating Metric</label>
                    <select id="rating" value={rating} onChange={(e) => setRating(Number(e.target.value))} className="premium-input h-9 py-0">
                      <option value="">Select options...</option>
                      <option value="1">1 - Poor performance</option>
                      <option value="2">2 - Fair build</option>
                      <option value="3">3 - Operational</option>
                      <option value="4">4 - Highly recommended</option>
                      <option value="5">5 - Exceptional standard</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="comment" className="text-xs font-medium text-slate-500">Comment / Feedback</label>
                    <textarea id="comment" rows="2" value={comment} onChange={(e) => setComment(e.target.value)} required placeholder="Write your verified product assessment..." className="premium-input h-auto py-2 resize-none" />
                  </div>
                  <button type="submit" disabled={loadingProductReview} className="premium-btn-primary w-full h-9 text-xs">
                    Submit Review Verification
                  </button>
                </form>
              ) : (
                <Message variant="info">
                  Please <Link to="/login" className="underline font-semibold">Sign In</Link> to append a product evaluation session.
                </Message>
              )}
            </div>

            {/* Guaranteed Pure Horizontal Swipe Deck Viewport Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400 flex items-center gap-2">
                  <FaCommentDots /> Historical Reviews Log
                </h3>
                {product.reviews.length > 0 && (
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 animate-pulse">Swipe &rarr;</span>
                )}
              </div>
              
              {product.reviews.length === 0 ? (
                <div className="text-xs text-slate-400 dark:text-slate-500 italic bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
                  No evaluation log segments present for this module.
                </div>
              ) : (
                /* Pure Horizontal Line Row Overflow Track Box */
                <div 
                  className="flex flex-row overflow-x-auto gap-4 pb-4 pt-1 snap-x snap-mandatory scroll-smooth"
                  style={{ scrollbarWidth: 'thin', msOverflowStyle: 'auto' }}
                >
                  {product.reviews.map((review) => (
                    <div 
                      key={review._id} 
                      className="premium-card min-w-[290px] max-w-[290px] flex-shrink-0 snap-start p-4 space-y-2.5 shadow-sm bg-gradient-to-b from-white to-slate-50/40 dark:from-slate-900 dark:to-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 transition-all duration-200 hover:scale-[1.01]"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-1.5">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                          {review.name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500">
                          {review.createdAt.substring(0, 10)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Rating value={review.rating} text="" />
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-light line-clamp-3 leading-relaxed italic">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProductScreen;