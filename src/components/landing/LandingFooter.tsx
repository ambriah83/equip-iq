
import React from 'react';
import { Brain } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="border-t border-slate-700 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-6 w-6 text-blue-400" />
              <span className="text-lg font-bold text-white">EquipIQ</span>
            </div>
            <p className="text-slate-400 text-sm">
              AI-powered equipment management for modern businesses.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="mailto:support@equipiq.com" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="mailto:support@equipiq.com" className="hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>&copy; 2024 EquipIQ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
