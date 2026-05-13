const Loader = () => {
  return (
    <div className='flex justify-center items-center py-12'>
      <div className='relative w-16 h-16'>
        <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-spin' />
        <div className='absolute inset-2 bg-white dark:bg-dark-900 rounded-full' />
      </div>
    </div>
  );
};

export default Loader;
