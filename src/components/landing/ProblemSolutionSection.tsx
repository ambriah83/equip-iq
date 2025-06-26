
import React from 'react';
import { CheckCircle } from 'lucide-react';

const ProblemSolutionSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">
            Stop Fighting Equipment Failures
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300">Unexpected breakdowns costing thousands in downtime</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300">Manual tracking across spreadsheets and paper logs</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300">Technicians waiting hours for expert troubleshooting</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-slate-300">Lost warranties and missed maintenance schedules</p>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white mb-6">
            Get Intelligent Equipment Control
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <p className="text-slate-300">AI predicts failures before they happen</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <p className="text-slate-300">Instant photo-to-data equipment logging</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <p className="text-slate-300">24/7 AI troubleshooting assistant</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <p className="text-slate-300">Automated warranty and maintenance tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemSolutionSection;
