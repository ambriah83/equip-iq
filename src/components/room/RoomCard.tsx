
import React from 'react';
import { MapPin, Edit, Layout } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Room } from '@/types/Room';

interface RoomCardProps {
  room: Room;
  equipmentCount: number;
  onEdit: (room: Room) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, equipmentCount, onEdit }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{room.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={14} />
              <span>Room #{room.number}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{room.locationAbbreviation}</Badge>
            <Button size="sm" variant="ghost" onClick={() => onEdit(room)}>
              <Edit size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-600">Equipment Count</p>
            <p className="text-lg font-bold text-blue-900">{equipmentCount}</p>
          </div>
          
          {room.floorPlan && (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Layout size={14} />
              <span>Floor plan available</span>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <p className="text-xs text-slate-500">
              Updated: {new Date(room.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoomCard;
