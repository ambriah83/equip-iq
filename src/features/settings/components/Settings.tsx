import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PersonalInfoTab, UserManagementTab, PermissionsTab, BillingTab, LocationsBillingTab, OwnerBillingTab, DropdownFieldsTab } from '@/components/settings';

const Settings = () => {
  const [activeTab, setActiveTab] = React.useState('users');

  const tabs = [
    { id: 'users', label: 'User Management', component: UserManagementTab },
    { id: 'permissions', label: 'Roles & Permissions', component: PermissionsTab },
    { id: 'system', label: 'System Settings', component: DropdownFieldsTab }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || UserManagementTab;

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-slate-600 to-slate-800 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3">
          <SettingsIcon size={24} />
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-slate-200">Manage users, permissions, and system configuration</p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <Card className="w-64 h-fit">
          <CardHeader>
            <CardTitle className="text-sm">Settings Menu</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        <div className="flex-1">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
};

export default Settings;