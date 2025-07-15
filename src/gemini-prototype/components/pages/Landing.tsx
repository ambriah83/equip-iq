import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from '../../lib/icons';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 text-gray-900 min-h-screen">
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-7 w-7 text-blue-500" />
          <h1 className="text-xl font-bold">EquipIQ</h1>
        </div>
        <button 
          onClick={() => navigate('/auth')} 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600"
        >
          Sign In
        </button>
      </header>
      
      <main>
        <section className="text-center py-20 md:py-32">
          <div className="container mx-auto px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-4">
              Equipment Downtime is Optional.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              EquipIQ is the AI-powered operating system for franchise maintenance. 
              Empower your staff, reduce costs, and maximize uptime.
            </p>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-600">
              Request a Demo
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;