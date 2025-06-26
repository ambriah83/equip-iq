
import React from 'react';
import { Brain } from 'lucide-react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Brain className="h-8 w-8 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">EquipIQ</h1>
      </div>
      <p className="text-slate-400">Smart Equipment Management with AI</p>
    </div>
  );
};

export default AuthHeader;
