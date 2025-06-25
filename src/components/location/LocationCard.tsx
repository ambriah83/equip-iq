
import React from 'react';
import { MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StatusBadge from '@/components/shared/StatusBadge';

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

interface LocationCardProps {
  location: Location;
  onViewDetails: (location: Location) => void;
  onManage: (location: Location) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, onViewDetails, onManage }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{location.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} />
              <span>{location.address}</span>
            </div>
          </div>
          <StatusBadge status={location.status} variant="location" />
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
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => onViewDetails(location)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
              onClick={() => onManage(location)}
            >
              Manage
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
