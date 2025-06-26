
import React from 'react';

const ROISection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-12 border border-blue-600/30">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            See Real Results in 30 Days
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">40%</div>
              <p className="text-slate-300">Less Equipment Downtime</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">$10K+</div>
              <p className="text-slate-300">Annual Cost Savings</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">75%</div>
              <p className="text-slate-300">Faster Issue Resolution</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ROISection;
