import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from '../../lib/icons';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const ThemeToggle: React.FC = () => (
    <button 
      onClick={toggleTheme} 
      className="flex items-center justify-between w-full p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg"
    >
      <span className="font-medium text-gray-800 dark:text-gray-200">Theme</span>
      <div className="relative w-12 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full">
        <span className={`absolute left-1 transition-transform duration-300 ease-in-out ${
          theme === 'light' ? 'translate-x-0' : 'translate-x-6'
        }`}>
          <Sun className="h-4 w-4 text-yellow-500" />
        </span>
        <span className={`absolute right-1 transition-transform duration-300 ease-in-out ${
          theme === 'dark' ? 'translate-x-0' : '-translate-x-6'
        }`}>
          <Moon className="h-4 w-4 text-white" />
        </span>
        <span 
          className="absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out" 
          style={{ transform: theme === 'light' ? 'translateX(0)' : 'translateX(1.5rem)' }}
        />
      </div>
    </button>
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>
      
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Appearance
          </h2>
          <ThemeToggle />
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            User profile settings coming soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;