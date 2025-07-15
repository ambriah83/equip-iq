import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles } from '../../lib/icons';

const AuthPage: React.FC = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    await login('test@test.com', 'password');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 flex flex-col justify-center items-center p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Sparkles className="h-8 w-8 text-blue-500" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">EquipIQ</h1>
      </div>
      
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="flex border-b dark:border-gray-700 mb-6">
          <button 
            onClick={() => setIsSignIn(true)} 
            className={`w-1/2 py-2 font-medium ${
              isSignIn 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsSignIn(false)} 
            className={`w-1/2 py-2 font-medium ${
              !isSignIn 
                ? 'text-blue-500 border-b-2 border-blue-500' 
                : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            Sign Up
          </button>
        </div>
        
        <form onSubmit={handleAuth}>
          <div className="space-y-4">
            {!isSignIn && (
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
              />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full px-4 py-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white" 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-6 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
          >
            {isSignIn ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;