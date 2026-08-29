import React from 'react';

const LoadingSpinner = ({ message = 'Loading handcrafted treasures...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div
        className={`${sizeClasses[size] || sizeClasses.md} border-moss-200 border-t-moss-700 rounded-full animate-spin`}
      ></div>
      {message && (
        <p className="mt-4 text-sm font-medium text-stone-600 font-sans tracking-wide">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
