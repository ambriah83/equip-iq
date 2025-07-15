
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { PersonalInfoTab, BillingTab, UserManagementTab, PermissionsTab, DropdownFieldsTab, OwnerBillingTab } from '@/components/settings/index';
import LocationsBillingTab from '@/components/settings/LocationsBillingTab';
import { LimbleDataImport } from '@/components/LimbleDataImport';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Settings as SettingsIcon, User, CreditCard, Users, Shield, ChevronDown, Building, MapPin, Upload } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('personal');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="fields">Fields</TabsTrigger>
          <TabsTrigger value="import">Import</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <PersonalInfoTab />
        </TabsContent>
        
        <TabsContent value="owner-billing">
          <OwnerBillingTab />
        </TabsContent>
        
        <TabsContent value="location-billing">
          <LocationsBillingTab />
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
        
        <TabsContent value="import">
          <ErrorBoundary>
            <LimbleDataImport />
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
