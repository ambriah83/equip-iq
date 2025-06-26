
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import LocationManagement from '@/components/LocationManagement';
import EquipmentManagement from '@/components/EquipmentManagement';
import VendorManagement from '@/components/VendorManagement';
import Settings from '@/components/Settings';
import { Button } from '@/components/ui/button';
import { Brain, MessageSquare, Wrench, Users, BarChart3, LogOut, CheckCircle, Star, Play, ArrowRight } from 'lucide-react';

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'ai-chat':
        return <AIChat />;
      case 'locations':
        return <LocationManagement />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'users':
        return <Settings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Not authenticated - show enhanced landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
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

        {/* Hero Section */}
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

        {/* Problem/Solution Section */}
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

        {/* Features Grid */}
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

        {/* ROI Section */}
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

        {/* CTA Section */}
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

        {/* Footer */}
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
      </div>
    );
  }

  // Authenticated - show main app
  return (
    <div className="flex h-screen bg-slate-50">
      <div className="relative">
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection}
          userRole="manager"
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          className="absolute bottom-4 left-4 right-4 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          <LogOut size={16} className="mr-2" />
          Sign Out
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
