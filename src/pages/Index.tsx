
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import EquipmentManagement from '@/components/EquipmentManagement';
import LocationManagement from '@/components/LocationManagement';
import VendorManagement from '@/components/VendorManagement';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [userRole] = useState('manager'); // This would come from authentication

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onSectionChange={setActiveSection} />;
      case 'ai-chat':
        return <AIChat />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'locations':
        return <LocationManagement />;
      case 'vendors':
        return <VendorManagement />;
      case 'knowledge-base':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
              <h2 className="text-xl font-bold">Knowledge Base</h2>
              <p className="text-blue-100">Manage manuals, procedures, and training materials</p>
            </div>
            <div className="mt-6 text-center text-slate-500">
              <p>Knowledge base management coming soon...</p>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
              <h2 className="text-xl font-bold">User Management</h2>
              <p className="text-blue-100">Manage team members and permissions</p>
            </div>
            <div className="mt-6 text-center text-slate-500">
              <p>User management coming soon...</p>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
              <h2 className="text-xl font-bold">Settings</h2>
              <p className="text-blue-100">Configure your system preferences</p>
            </div>
            <div className="mt-6 text-center text-slate-500">
              <p>Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onSectionChange={setActiveSection} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        userRole={userRole}
      />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
