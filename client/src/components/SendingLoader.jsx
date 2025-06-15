const SendingBubble = () => {
  return (
    <div className="flex w-full justify-end">
      <div className="bg-blue-600 text-white px-1 py-1 rounded-2xl rounded-br-none shadow-md max-w-xs md:max-w-sm lg:max-w-md">
        <div className="flex space-x-1 items-center">
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
        </div>
      </div>
    </div>
  );
};

export default SendingBubble;
