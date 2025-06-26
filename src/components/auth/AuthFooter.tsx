
import React from 'react';

const AuthFooter = () => {
  return (
    <p className="text-center text-slate-400 text-sm mt-6">
      By signing up, you agree to our{' '}
      <a 
        href="/terms" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 hover:text-blue-300 underline"
      >
        Terms of Service
      </a>
      {' '}and{' '}
      <a 
        href="/privacy" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-blue-400 hover:text-blue-300 underline"
      >
        Privacy Policy
      </a>
    </p>
  );
};

export default AuthFooter;
