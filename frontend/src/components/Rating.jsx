import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color }) => {
  const stars = [1, 2, 3, 4, 5].map((star) => {
    if (value >= star) return <FaStar key={star} />;
    if (value >= star - 0.5) return <FaStarHalfAlt key={star} />;
    return <FaRegStar key={star} />;
  });

  return (
    <div className='rating' style={{ color }}>
      <span className='rating-stars'>
        {stars}
      </span>
      <span className='rating-text'>{text && text}</span>
    </div>
  );
};

Rating.defaultProps = {
  color: '#f8e825',
};

export default Rating;
