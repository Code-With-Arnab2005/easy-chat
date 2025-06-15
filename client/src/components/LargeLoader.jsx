const DarkBackgroundLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex space-x-2">
        <span className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
        <span className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
        <span className="w-4 h-4 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
      </div>
    </div>
  );
};

export default DarkBackgroundLoader;
