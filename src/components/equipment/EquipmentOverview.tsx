
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EquipmentWithDetails } from '@/hooks/useEquipment';

interface EquipmentOverviewProps {
  equipment: EquipmentWithDetails[];
}

const EquipmentOverview: React.FC<EquipmentOverviewProps> = ({ equipment }) => {
  const activeCount = equipment.filter(eq => eq.status === 'active').length;
  const maintenanceCount = equipment.filter(eq => eq.status === 'maintenance').length;
  const warrantyExpiringCount = equipment.filter(eq => 
    eq.warranty_status === 'active' && 
    eq.warranty_expiry_date && 
    new Date(eq.warranty_expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Equipment Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{equipment.length}</p>
            <p className="text-sm text-slate-600">Total Equipment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            <p className="text-sm text-slate-600">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{maintenanceCount}</p>
            <p className="text-sm text-slate-600">In Maintenance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{warrantyExpiringCount}</p>
            <p className="text-sm text-slate-600">Warranty Expiring</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentOverview;
