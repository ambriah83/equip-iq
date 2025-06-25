import React, { useState } from 'react';
import { Building2, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AddLocationDialog from './AddLocationDialog';

interface Location {
  id: string;
  name: string;
  address: string;
  manager: string;
  equipmentCount: number;
  activeIssues: number;
  status: 'active' | 'maintenance' | 'closed';
  lastUpdated: string;
}

const LocationManagement = () => {
  const locations: Location[] = [
    {
      id: '1',
      name: 'Sunshine Tanning - Downtown',
      address: '123 Main St, City, State 12345',
      manager: 'Sarah Johnson',
      equipmentCount: 12,
      activeIssues: 2,
      status: 'active',
      lastUpdated: '2024-01-25'
    },
    {
      id: '2',
      name: 'Golden Glow - Westside',
      address: '456 Oak Ave, City, State 12345',
      manager: 'Mike Chen',
      equipmentCount: 8,
      activeIssues: 0,
      status: 'active',
      lastUpdated: '2024-01-24'
    },
    {
      id: '3',
      name: 'Radiant Wellness - North',
      address: '789 Pine Blvd, City, State 12345',
      manager: 'Emily Davis',
      equipmentCount: 15,
      activeIssues: 1,
      status: 'maintenance',
      lastUpdated: '2024-01-23'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <div>
              <h2 className="text-xl font-bold">Location Management</h2>
              <p className="text-blue-100">Manage all franchise locations and their details</p>
            </div>
          </div>
          <AddLocationDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {locations.map((location) => (
          <Card key={location.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{location.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <MapPin size={16} />
                    <span>{location.address}</span>
                  </div>
                </div>
                <Badge className={getStatusColor(location.status)}>
                  {location.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-slate-500" />
                  <span className="text-sm">Manager: {location.manager}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-600">Equipment</p>
                    <p className="text-lg font-bold text-blue-900">{location.equipmentCount}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-red-600">Active Issues</p>
                    <p className="text-lg font-bold text-red-900">{location.activeIssues}</p>
                  </div>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-slate-500">Last updated: {location.lastUpdated}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
              <p className="text-sm text-slate-600">Total Locations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {locations.reduce((sum, loc) => sum + loc.equipmentCount, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Equipment</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {locations.reduce((sum, loc) => sum + loc.activeIssues, 0)}
              </p>
              <p className="text-sm text-slate-600">Active Issues</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {locations.filter(loc => loc.status === 'active').length}
              </p>
              <p className="text-sm text-slate-600">Active Locations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LocationManagement;
