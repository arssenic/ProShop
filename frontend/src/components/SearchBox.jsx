import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

const SearchBox = () => {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || '');

  useEffect(() => {
    setKeyword(urlKeyword || '');
  }, [urlKeyword]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword.trim()}`);
    } else {
      navigate('/');
    }
  };

  return (
    <form onSubmit={submitHandler} className='flex items-center'>
      <input
        type='text'
        name='q'
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder='Search Products...'
        className='px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64'
      />
      <button
        type='submit'
        className='px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors flex items-center space-x-2'
      >
        <FaSearch />
        <span className='hidden sm:inline'>Search</span>
      </button>
    </form>
  );
};

export default SearchBox;
