
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-6">
          Ready to Transform Your Equipment Management?
        </h2>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Join 1,000+ companies already saving time and money with EquipIQ
        </p>
        <Button 
          size="lg" 
          onClick={() => navigate('/auth')}
          className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 flex items-center gap-2 mx-auto"
        >
          Start Your Free Trial
          <ArrowRight className="h-5 w-5" />
        </Button>
        <p className="text-sm text-slate-400 mt-4">Free 14-day trial • Setup in under 5 minutes</p>
      </div>
    </div>
  );
};

export default CTASection;
