import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PersonalInfoTab, BillingTab, UserManagementTab, PermissionsTab, DropdownFieldsTab, OwnerBillingTab } from '@/components/settings';
import { Settings as SettingsIcon, User, CreditCard, Users, Shield, ChevronDown, Building } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <div className="flex items-center gap-3">
          <SettingsIcon size={24} />
          <div>
            <h2 className="text-xl font-bold">Settings</h2>
            <p className="text-blue-100">Manage your account and system preferences</p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Configure your EquipIQ system settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User size={16} />
                Personal
              </TabsTrigger>
              <TabsTrigger value="owner-billing" className="flex items-center gap-2">
                <Building size={16} />
                Owner Billing
              </TabsTrigger>
              <TabsTrigger value="billing" className="flex items-center gap-2">
                <CreditCard size={16} />
                Billing
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users size={16} />
                Users
              </TabsTrigger>
              <TabsTrigger value="permissions" className="flex items-center gap-2">
                <Shield size={16} />
                Permissions
              </TabsTrigger>
              <TabsTrigger value="fields" className="flex items-center gap-2">
                <ChevronDown size={16} />
                Fields
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6">
              <TabsContent value="personal">
                <PersonalInfoTab />
              </TabsContent>
              
              <TabsContent value="owner-billing">
                <OwnerBillingTab />
              </TabsContent>
              
              <TabsContent value="billing">
                <BillingTab />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagementTab />
              </TabsContent>
              
              <TabsContent value="permissions">
                <PermissionsTab />
              </TabsContent>
              
              <TabsContent value="fields">
                <DropdownFieldsTab />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
