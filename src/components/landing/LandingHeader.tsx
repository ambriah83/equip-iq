
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain } from 'lucide-react';

const LandingHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-blue-400" />
            <span className="text-xl font-bold text-white">EquipIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
              className="text-slate-200 hover:bg-slate-700"
            >
              Sign In
            </Button>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
