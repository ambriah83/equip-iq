
import React from 'react';
import { MapPin, Users, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import { Database } from '@/integrations/supabase/types';

type DatabaseLocation = Database['public']['Tables']['locations']['Row'];

interface LocationCardProps {
  location: DatabaseLocation;
  onViewDetails: (location: DatabaseLocation) => void;
  onManage: (location: DatabaseLocation) => void;
  roomCount?: number;
}

const LocationCard: React.FC<LocationCardProps> = ({ 
  location, 
  onViewDetails, 
  onManage, 
  roomCount = 0 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{location.name}</CardTitle>
              <Badge variant="secondary">{location.abbreviation}</Badge>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} />
              <span>{location.address || 'No address provided'}</span>
            </div>
          </div>
          <StatusBadge status={location.status as 'active' | 'maintenance' | 'closed'} variant="location" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-slate-500" />
            <span className="text-sm">Manager: {location.manager_name || 'Not assigned'}</span>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-purple-50 p-3 rounded-lg">
              <div className="flex items-center gap-1 mb-1">
                <Home size={14} className="text-purple-600" />
                <p className="text-xs text-purple-600">Rooms</p>
              </div>
              <p className="text-lg font-bold text-purple-900">{roomCount}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600">Equipment</p>
              <p className="text-lg font-bold text-blue-900">0</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-600">Issues</p>
              <p className="text-lg font-bold text-red-900">0</p>
            </div>
          </div>

          <div className="pt-3 border-t">
            <p className="text-xs text-slate-500">Last updated: {new Date(location.updated_at).toLocaleDateString()}</p>
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
