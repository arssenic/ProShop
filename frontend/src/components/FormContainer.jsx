const FormContainer = ({ children }) => {
  return (
    <div className='flex justify-center py-8'>
      <div className='w-full max-w-md'>
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
