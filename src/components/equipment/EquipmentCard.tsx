
import React from 'react';
import { Edit, Image, FileText, Layout, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StatusBadge from '@/components/shared/StatusBadge';
import { EquipmentWithDetails } from '@/hooks/useEquipment';

interface EquipmentCardProps {
  equipment: EquipmentWithDetails;
  onEdit: (equipment: EquipmentWithDetails) => void;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, onEdit }) => {
  const isWarrantyActive = equipment.warranty_status === 'active';
  const isExpiringSoon = equipment.warranty_expiry_date && 
    new Date(equipment.warranty_expiry_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {equipment.name}
            </CardTitle>
            <p className="text-sm text-slate-600">{equipment.equipment_types?.name}</p>
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
            <span className="text-sm font-medium">{equipment.locations?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Room:</span>
            <span className="text-sm font-medium">{equipment.rooms?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Serial:</span>
            <span className="text-sm font-medium">{equipment.serial_number || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">TMAX:</span>
            <span className="text-sm font-medium">{equipment.tmax_connection || 'Not specified'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-slate-600">Last Service:</span>
            <span className="text-sm font-medium">{equipment.last_service_date ? new Date(equipment.last_service_date).toLocaleDateString() : 'Never'}</span>
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
                  {equipment.warranty_status === 'active' ? (isExpiringSoon ? 'Expiring Soon' : 'Active') : 'Inactive'}
                </Badge>
                {equipment.warranty_expiry_date && isWarrantyActive && (
                  <span className="text-sm font-medium">
                    Until {new Date(equipment.warranty_expiry_date).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {(equipment.equipment_photo_url || equipment.room_layout_url || equipment.room_photo_url) && (
            <div className="pt-2 border-t">
              <p className="text-xs text-slate-500 mb-2">Media & Documents:</p>
              <div className="flex gap-2 flex-wrap">
                {equipment.equipment_photo_url && (
                  <Badge variant="outline" className="text-xs">
                    <Image size={12} className="mr-1" />
                    Equipment
                  </Badge>
                )}
                {equipment.room_layout_url && (
                  <Badge variant="outline" className="text-xs">
                    <Layout size={12} className="mr-1" />
                    Layout
                  </Badge>
                )}
                {equipment.room_photo_url && (
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
