const Message = ({ variant = 'info', children }) => {
  const variantClasses = {
    success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 border border-green-400 dark:border-green-700',
    danger: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 border border-red-400 dark:border-red-700',
    warning: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-100 border border-yellow-400 dark:border-yellow-700',
    info: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border border-blue-400 dark:border-blue-700',
  };

  return (
    <div className={`p-4 rounded-lg ${variantClasses[variant] || variantClasses.info}`}>
      {children}
    </div>
  );
};

export default Message;
