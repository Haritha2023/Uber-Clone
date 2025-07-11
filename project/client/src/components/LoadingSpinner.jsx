import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
        <div className="absolute top-0 left-0 w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;