
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, CreditCard, Settings as SettingsIcon, List, Shield } from 'lucide-react';
import {
  PersonalInfoTab,
  BillingTab,
  UserManagementTab,
  DropdownFieldsTab,
  PermissionsTab
} from './settings';

const Settings = () => {
  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-blue-100">Manage your account, users, and system configuration</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User size={16} />
            Users
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield size={16} />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <SettingsIcon size={16} />
            Personal
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard size={16} />
            Billing
          </TabsTrigger>
          <TabsTrigger value="dropdowns" className="flex items-center gap-2">
            <List size={16} />
            Dropdowns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserManagementTab />
        </TabsContent>

        <TabsContent value="permissions">
          <PermissionsTab />
        </TabsContent>

        <TabsContent value="personal">
          <PersonalInfoTab />
        </TabsContent>

        <TabsContent value="billing">
          <BillingTab />
        </TabsContent>

        <TabsContent value="dropdowns">
          <DropdownFieldsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
