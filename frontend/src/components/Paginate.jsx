import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Paginate = ({
  pages,
  page,
  isAdmin = false,
  keyword = '',
  category = '',
}) => {
  return (
    pages > 1 && (
      <motion.div
        className='flex flex-wrap justify-center gap-2 py-8'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {[...Array(pages).keys()].map((x) => (
          <Link
            key={x + 1}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${x + 1}`
                  : category
                    ? `/category/${category}/page/${x + 1}`
                    : `/page/${x + 1}`
                : `/admin/productlist/${x + 1}`
            }
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              x + 1 === page
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-gray-200 dark:bg-dark-700 text-gray-900 dark:text-gray-300 hover:bg-blue-500 dark:hover:bg-blue-600 hover:text-white'
            }`}
          >
            {x + 1}
          </Link>
        ))}
      </motion.div>
    )
  );
};

export default Paginate;
