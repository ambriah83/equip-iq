
import React, { useState } from 'react';
import { Wrench, MapPin, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { useEquipment, EquipmentWithDetails } from '@/hooks/useEquipment';
import { useLocations } from '@/hooks/useLocations';
import { DataTable, FilterBar, StatusBadge } from '@/components/shared';
import { EquipmentCard, WarrantyAlert, AddEquipmentDialog, EditEquipmentDialog } from '@/components/equipment';
import ViewToggle from './ViewToggle';

const EquipmentManagement = () => {
  const { view, setView } = useViewToggle();
  const { equipment, loading, createEquipment, updateEquipment, deleteEquipment } = useEquipment();
  const { locations } = useLocations();
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentWithDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    showFilters,
    setShowFilters,
    filteredData: filteredEquipment,
    clearAllFilters,
    hasActiveFilters
  } = useDataFiltering({
    data: equipment,
    searchFields: ['name', 'serial_number'],
    filterConfigs: {
      status: 'Status',
      warranty_status: 'Warranty',
      equipment_type: 'Type'
    }
  });

  const handleEditEquipment = (equipment: EquipmentWithDetails) => {
    setSelectedEquipment(equipment);
    setIsEditDialogOpen(true);
  };

  const handleSaveEquipment = async (equipmentData: any) => {
    try {
      if (selectedEquipment) {
        await updateEquipment(selectedEquipment.id, equipmentData);
      } else {
        await createEquipment(equipmentData);
      }
      setIsEditDialogOpen(false);
      setSelectedEquipment(null);
    } catch (error) {
      console.error('Failed to save equipment:', error);
    }
  };

  const columns = [
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

  const renderActions = (equipment: EquipmentWithDetails) => (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" onClick={() => handleEditEquipment(equipment)}>
        <Edit size={16} />
      </Button>
    </div>
  );

  const filterConfigs = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'maintenance', label: 'Maintenance' },
        { value: 'offline', label: 'Offline' }
      ],
      value: filters.status,
      onChange: (value: string) => updateFilter('status', value)
    },
    {
      key: 'warranty_status',
      label: 'Warranty',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      value: filters.warranty_status,
      onChange: (value: string) => updateFilter('warranty_status', value)
    }
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredEquipment.map((equipment) => (
        <EquipmentCard
          key={equipment.id}
          equipment={equipment}
          onEdit={handleEditEquipment}
        />
      ))}
    </div>
  );

  if (loading) {
    return <div className="p-6">Loading equipment...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench size={24} />
            <div>
              <h2 className="text-xl font-bold">Equipment Management</h2>
              <p className="text-blue-100">Track and maintain all equipment across locations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <AddEquipmentDialog />
          </div>
        </div>
      </div>

      <WarrantyAlert equipment={equipment} />

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search equipment by name or serial number..."
        filters={filterConfigs}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredEquipment.length}
        totalCount={equipment.length}
      />

      {view === 'card' ? renderCardView() : (
        <DataTable
          data={filteredEquipment}
          columns={columns}
          onEdit={handleEditEquipment}
          actions={renderActions}
        />
      )}

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
              <p className="text-2xl font-bold text-green-600">
                {equipment.filter(eq => eq.status === 'active').length}
              </p>
              <p className="text-sm text-slate-600">Active</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {equipment.filter(eq => eq.status === 'maintenance').length}
              </p>
              <p className="text-sm text-slate-600">In Maintenance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {equipment.filter(eq => eq.warranty_status === 'active' && eq.warranty_expiry_date && new Date(eq.warranty_expiry_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
              </p>
              <p className="text-sm text-slate-600">Warranty Expiring</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditEquipmentDialog
        equipment={selectedEquipment}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedEquipment(null);
        }}
        onSave={handleSaveEquipment}
      />
    </div>
  );
};

export default EquipmentManagement;
