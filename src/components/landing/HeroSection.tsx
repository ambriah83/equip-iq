
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Star, Play, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center">
        <div className="mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-600/20 text-blue-400 border border-blue-600/30">
            <Star className="h-4 w-4 mr-1" />
            Trusted by 1,000+ companies
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Smart Equipment Management
          <span className="text-blue-400 block">with AI-Powered Insights</span>
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
          Reduce equipment downtime by 40% and save $10K+ annually with intelligent 
          maintenance scheduling, instant AI troubleshooting, and predictive analytics.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            onClick={() => navigate('/auth')}
            className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            Start Free Trial
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="text-lg px-8 py-6 border-slate-600 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
          >
            <Play className="h-5 w-5" />
            Watch Demo
          </Button>
        </div>
        <p className="text-sm text-slate-400 mt-4">Free 14-day trial • No credit card required</p>
      </div>
    </div>
  );
};

export default HeroSection;
