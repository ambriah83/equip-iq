import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Dashboard from '@/features/dashboard/components/Dashboard';
import EquipmentManagement from '@/features/equipment/components/EquipmentManagement';
import LocationManagement from '@/features/locations/components/LocationManagement';
import VendorManagement from '@/features/vendors/components/VendorManagement';
import AIChat from '@/features/ai/components/AIChat';
import Settings from '@/features/settings/components/Settings';

type Section = 'dashboard' | 'equipment' | 'locations' | 'vendors' | 'ai-chat' | 'users' | 'settings';

const AuthenticatedApp = () => {
  const [activeSection, setActiveSection] = useState<Section>('dashboard');

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'ai-chat':
        return <AIChat />;
      case 'users':
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="flex-1 overflow-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default AuthenticatedApp;