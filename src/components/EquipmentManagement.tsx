
import React, { useState } from 'react';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { useEquipment, EquipmentWithDetails } from '@/hooks/useEquipment';
import { DataTable, FilterBar } from '@/components/shared';
import { EquipmentCard, WarrantyAlert } from '@/components/equipment';
import EquipmentHeader from '@/components/equipment/EquipmentHeader';
import EquipmentOverview from '@/components/equipment/EquipmentOverview';
import { getEquipmentColumns } from '@/components/equipment/EquipmentTableColumns';
import { getEquipmentFilterConfigs } from '@/components/equipment/EquipmentFilters';
import EditEquipmentDialog from './EditEquipmentDialog';

const EquipmentManagement = () => {
  const { view, setView } = useViewToggle();
  const { equipment, loading, createEquipment, updateEquipment, deleteEquipment } = useEquipment();
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

  const columns = getEquipmentColumns();

  const renderActions = (equipment: EquipmentWithDetails) => (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" onClick={() => handleEditEquipment(equipment)}>
        <Edit size={16} />
      </Button>
    </div>
  );

  const filterConfigs = getEquipmentFilterConfigs(filters, updateFilter);

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
      <EquipmentHeader view={view} onViewChange={setView} />

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

      <EquipmentOverview equipment={equipment} />

      <EditEquipmentDialog
        equipment={selectedEquipment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onUpdateEquipment={handleSaveEquipment}
      />
    </div>
  );
};

export default EquipmentManagement;
