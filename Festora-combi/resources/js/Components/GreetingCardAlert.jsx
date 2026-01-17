import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

const GreetingCardAlert = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Show the alert after a short delay when component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleCreateCard = () => {
    // Redirect to festivals page with a parameter to open greeting card modal
    window.location.href = '/festivals?createGreetingCard=true';
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-md transition-all duration-300 ease-out ${isClosing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}>
      <div className="relative bg-gradient-to-br from-blue-900 via-gray-900 to-blue-800 rounded-xl shadow-xl p-6 text-white overflow-hidden border border-blue-700/50">
        {/* Subtle animated background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-blue-500/5 to-transparent -translate-x-full animate-shimmer"></div>
        </div>
        
        {/* Close button */}
        <button 
          onClick={handleClose}
          className="absolute top-3 right-3 text-blue-300 hover:text-white transition-colors duration-200 z-10"
          aria-label="Close alert"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Content */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-2 flex items-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            Spread Your Love Virtually
          </h3>
          <p className="mb-4 text-blue-100/90 text-sm">
            Create beautiful virtual greeting cards with animations and personalized messages for any festival occasion.
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={handleCreateCard}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 shadow-md flex items-center justify-center border border-blue-500/30 hover:shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Greeting Card
            </button>
            <button
              onClick={handleClose}
              className="bg-transparent border border-blue-600/30 text-blue-200 font-medium py-2 px-4 rounded-lg hover:bg-blue-800/30 hover:text-white transition-all duration-200"
            >
              Later
            </button>
          </div>
        </div>
        
        {/* Animation styles */}
        <style jsx>{`
          @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
          
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
        `}</style>
      </div>
    </div>
  );
};

export default GreetingCardAlert;