
import React from 'react';
import { MapPin } from 'lucide-react';
import { StatusBadge } from '@/components/shared';
import { EquipmentWithDetails } from '@/hooks/useEquipment';

export const getEquipmentColumns = () => [
  {
    key: 'name',
    label: 'Equipment',
    render: (equipment: EquipmentWithDetails) => (
      <div>
        <div className="font-medium">{equipment.name}</div>
        <div className="text-sm text-slate-600">{equipment.equipment_types?.name}</div>
        <div className="text-xs text-slate-500">{equipment.serial_number}</div>
      </div>
    )
  },
  {
    key: 'location',
    label: 'Location',
    render: (equipment: EquipmentWithDetails) => (
      <div className="flex items-center gap-1">
        <MapPin size={12} />
        <span className="text-sm">{equipment.locations?.name}</span>
        {equipment.rooms && (
          <span className="text-xs text-slate-500">• {equipment.rooms.name}</span>
        )}
      </div>
    )
  },
  {
    key: 'status',
    label: 'Status',
    render: (equipment: EquipmentWithDetails) => (
      <StatusBadge status={equipment.status} variant="equipment" />
    )
  },
  {
    key: 'warranty_status',
    label: 'Warranty',
    render: (equipment: EquipmentWithDetails) => (
      <StatusBadge status={equipment.warranty_status} variant="warranty" />
    )
  },
  {
    key: 'last_service_date',
    label: 'Last Service',
    render: (equipment: EquipmentWithDetails) => (
      <span>{equipment.last_service_date ? new Date(equipment.last_service_date).toLocaleDateString() : 'Never'}</span>
    )
  }
];
