
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import LocationManagement from '@/components/LocationManagement';
import EquipmentManagement from '@/components/EquipmentManagement';
import VendorManagement from '@/components/VendorManagement';
import Settings from '@/components/Settings';

interface AuthenticatedAppProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AuthenticatedApp = ({ activeSection, setActiveSection }: AuthenticatedAppProps) => {
  const navigate = useNavigate();

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
      case 'tickets':
        return <div>Tickets page - Please navigate to /tickets</div>;
      case 'users':
        return <Settings />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

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

export default AuthenticatedApp;
