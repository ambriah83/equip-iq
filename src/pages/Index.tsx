
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
import { Building2, MessageSquare, Wrench, Users, BarChart3, LogOut } from 'lucide-react';

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
        return <Settings activeTab="users" />;
      case 'settings':
        return <Settings activeTab="personal" />;
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

  // Not authenticated - show landing page
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Header */}
        <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-blue-400" />
                <span className="text-xl font-bold text-white">Operations Hub</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/auth')}
                className="border-slate-600 text-slate-200 hover:bg-slate-700"
              >
                Sign In
              </Button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              AI-Powered Equipment
              <span className="text-blue-400 block">Support Hub</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
              Streamline your operations with intelligent equipment management, instant AI assistance, 
              and comprehensive location oversight. Built for modern businesses.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/auth')}
              className="text-lg px-8 py-6 bg-blue-600 hover:bg-blue-700"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Real-time Dashboard</h3>
              <p className="text-slate-400">Monitor all your equipment and operations from one central location</p>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <MessageSquare className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-slate-400">Get instant help and troubleshooting guidance powered by AI</p>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <Wrench className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Equipment Management</h3>
              <p className="text-slate-400">Track, maintain, and optimize all your equipment lifecycle</p>
            </div>
            <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
              <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Team Collaboration</h3>
              <p className="text-slate-400">Manage users, permissions, and streamline team workflows</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-700 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-slate-400">
              <p>&copy; 2024 Operations Hub. AI-Powered Equipment Support.</p>
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
