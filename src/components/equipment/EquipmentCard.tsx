import React from 'react';
import { Edit, Image, FileText, Layout, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  room: string;
  serialNumber: string;
  status: 'active' | 'maintenance' | 'offline';
  lastService: string;
  warranty: {
    status: 'active' | 'inactive';
    expiryDate?: string;
    documentation?: string[];
  };
  tmaxConnection?: 'Wired' | 'Wireless';
  equipmentPhoto?: string;
  documentation?: string[];
  roomLayout?: string;
  roomPhoto?: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  onEdit: (equipment: Equipment) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onEdit }) => {
  const isWarrantyActive = equipment.warranty.status === 'active';
  const isExpiringSoon = equipment.warranty.expiryDate && 
    new Date(equipment.warranty.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {equipment.name}
            </CardTitle>
            <p className="text-sm text-slate-600">{equipment.type}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={equipment.status} variant="equipment" />
            <Button size="sm" variant="ghost" onClick={() => onEdit(equipment)}>
              <Edit size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Location:</span>
            <span className="text-sm font-medium">{equipment.location}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Room:</span>
            <span className="text-sm font-medium">{equipment.room}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Serial:</span>
            <span className="text-sm font-medium">{equipment.serialNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">TMAX:</span>
            <span className="text-sm font-medium">{equipment.tmaxConnection || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Last Service:</span>
            <span className="text-sm font-medium">{equipment.lastService}</span>
          </div>
          
          <div className="pt-2 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Warranty Status:</span>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={isWarrantyActive ? "default" : "secondary"} 
                  className={`text-xs ${isWarrantyActive ? (isExpiringSoon ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600') : ''}`}
                >
                  <Shield size={12} className="mr-1" />
                  {equipment.warranty.status === 'active' ? (isExpiringSoon ? 'Expiring Soon' : 'Active') : 'Inactive'}
                </Badge>
                {equipment.warranty.expiryDate && isWarrantyActive && (
                  <span className="text-sm font-medium">
                    Until {new Date(equipment.warranty.expiryDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {(equipment.equipmentPhoto || equipment.documentation || equipment.warranty.documentation || equipment.roomLayout || equipment.roomPhoto) && (
            <div className="pt-2 border-t">
              <p className="text-xs text-slate-500 mb-2">Media & Documents:</p>
              <div className="flex gap-2 flex-wrap">
                {equipment.equipmentPhoto && (
                  <Badge variant="outline" className="text-xs">
                    <Image size={12} className="mr-1" />
                    Equipment
                  </Badge>
                )}
                {equipment.documentation && equipment.documentation.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <FileText size={12} className="mr-1" />
                    Docs ({equipment.documentation.length})
                  </Badge>
                )}
                {equipment.warranty.documentation && equipment.warranty.documentation.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Shield size={12} className="mr-1" />
                    Warranty ({equipment.warranty.documentation.length})
                  </Badge>
                )}
                {equipment.roomLayout && (
                  <Badge variant="outline" className="text-xs">
                    <Layout size={12} className="mr-1" />
                    Layout
                  </Badge>
                )}
                {equipment.roomPhoto && (
                  <Badge variant="outline" className="text-xs">
                    <Image size={12} className="mr-1" />
                    Room
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
