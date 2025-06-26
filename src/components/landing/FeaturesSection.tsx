
import React from 'react';
import { BarChart3, MessageSquare, Wrench, Users } from 'lucide-react';

const FeaturesSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white mb-4">
          Everything You Need to Master Equipment Management
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          From AI-powered insights to seamless team collaboration
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors">
          <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Smart Dashboard</h3>
          <p className="text-slate-400">Real-time equipment health monitoring with predictive analytics</p>
        </div>
        <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors">
          <MessageSquare className="h-12 w-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
          <p className="text-slate-400">Instant troubleshooting and maintenance guidance powered by AI</p>
        </div>
        <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors">
          <Wrench className="h-12 w-12 text-orange-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Photo-to-Data</h3>
          <p className="text-slate-400">Snap photos to automatically extract equipment data and specs</p>
        </div>
        <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700 hover:bg-slate-800/70 transition-colors">
          <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Team Workflows</h3>
          <p className="text-slate-400">Streamlined collaboration with role-based access and permissions</p>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
