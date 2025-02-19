// components/Layout/Loader.jsx
const Loader = ({ size = 'medium', className = '' }) => {
    const sizeClasses = {
      small: 'h-8 w-8 border-2',
      medium: 'h-12 w-12 border-b-2',
      large: 'h-16 w-16 border-b-4'
    };
  
    return (
      <div className={`flex justify-center items-center ${className}`}>
        <div
          className={`animate-spin rounded-full border-blue-500 ${sizeClasses[size]}`}
          style={{
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: 'transparent'
          }}
        ></div>
      </div>
    );
  };
  
  export default Loader;