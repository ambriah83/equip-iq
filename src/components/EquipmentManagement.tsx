import React, { useState } from 'react';
import { Wrench, Edit, Image, FileText, Layout, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/contexts/SettingsContext';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DataTable from '@/components/shared/DataTable';
import FilterBar from '@/components/shared/FilterBar';
import StatusBadge from '@/components/shared/StatusBadge';
import AddEquipmentDialog from './AddEquipmentDialog';
import EditEquipmentDialog from './EditEquipmentDialog';
import ViewToggle from './ViewToggle';

interface Equipment {
  id: string;
  name: string;
  type: string;
  location: string;
  room: string;
  serialNumber: string;
  status: 'active' | 'maintenance' | 'offline';
  lastService: string;
  warranty: string;
  tmaxConnection?: 'Wired' | 'Wireless';
  equipmentPhoto?: string;
  documentation?: string[];
  warrantyDocumentation?: string[];
  roomLayout?: string;
  roomPhoto?: string;
}

const EquipmentManagement = () => {
  const { view, setView } = useViewToggle();
  const { settings } = useSettings();
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  
  const [equipment, setEquipment] = useLocalStorage<Equipment[]>('equipment', [
    {
      id: '1',
      name: 'Tanning Bed #3',
      type: 'Sun',
      location: 'Location A',
      room: 'Room 3',
      serialNumber: 'TB-2023-003',
      status: 'active',
      lastService: '2024-01-15',
      warranty: 'Active until 2025-06-30',
      tmaxConnection: 'Wired',
      equipmentPhoto: 'tanning-bed-3.jpg',
      documentation: ['manual.pdf', 'maintenance-guide.pdf'],
      warrantyDocumentation: ['warranty-2023.pdf'],
      roomLayout: 'room-3-layout.jpg',
      roomPhoto: 'room-3-photo.jpg'
    },
    {
      id: '2',
      name: 'HVAC Unit #1',
      type: 'HVAC',
      location: 'Location B',
      room: 'Main Floor',
      serialNumber: 'HVAC-2022-001',
      status: 'maintenance',
      lastService: '2024-01-10',
      warranty: 'Expired',
      tmaxConnection: 'Wireless',
      warrantyDocumentation: ['warranty-expired-2022.pdf']
    },
    {
      id: '3',
      name: 'Water Heater',
      type: 'Other',
      location: 'Location C',
      room: 'Utility Room',
      serialNumber: 'WH-2023-001',
      status: 'offline',
      lastService: '2023-12-20',
      warranty: 'Active until 2026-03-15',
      tmaxConnection: 'Wired',
      warrantyDocumentation: ['warranty-2023.pdf', 'extended-warranty.pdf']
    },
    {
      id: '4',
      name: 'Red Light Therapy Unit #2',
      type: 'Red Light',
      location: 'Location A',
      room: 'Room 7',
      serialNumber: 'LT-2023-002',
      status: 'active',
      lastService: '2024-01-20',
      warranty: 'Active until 2025-12-31',
      tmaxConnection: 'Wireless',
      warrantyDocumentation: ['warranty-2023.pdf']
    }
  ]);

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
    searchFields: ['name', 'location', 'type', 'room'],
    filterConfigs: {
      status: 'Status',
      type: 'Type',
      location: 'Location'
    }
  });

  // Get unique values for filter options
  const uniqueLocations = [...new Set(equipment.map(item => item.location))];

  const handleEdit = (equipmentItem: Equipment) => {
    setEditingEquipment(equipmentItem);
    setEditDialogOpen(true);
  };

  const handleUpdateEquipment = (updatedEquipment: Equipment) => {
    setEquipment(prev => prev.map(item => 
      item.id === updatedEquipment.id ? updatedEquipment : item
    ));
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (item: Equipment) => (
        <div className="font-medium">{item.name}</div>
      )
    },
    {
      key: 'type',
      label: 'Type'
    },
    {
      key: 'location',
      label: 'Location'
    },
    {
      key: 'room',
      label: 'Room'
    },
    {
      key: 'tmaxConnection',
      label: 'TMAX',
      render: (item: Equipment) => (
        <span>{item.tmaxConnection || 'Not specified'}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (item: Equipment) => (
        <StatusBadge status={item.status} variant="equipment" />
      )
    },
    {
      key: 'lastService',
      label: 'Last Service'
    },
    {
      key: 'media',
      label: 'Media',
      render: (item: Equipment) => (
        <div className="flex gap-1">
          {item.equipmentPhoto && <Image size={14} className="text-slate-400" />}
          {item.documentation && item.documentation.length > 0 && <FileText size={14} className="text-slate-400" />}
          {item.warrantyDocumentation && item.warrantyDocumentation.length > 0 && <Shield size={14} className="text-slate-400" />}
          {item.roomLayout && <Layout size={14} className="text-slate-400" />}
        </div>
      )
    }
  ];

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
      key: 'type',
      label: 'Type',
      options: settings.equipmentTypes.map(type => ({ value: type, label: type })),
      value: filters.type,
      onChange: (value: string) => updateFilter('type', value)
    },
    {
      key: 'location',
      label: 'Location',
      options: uniqueLocations.map(location => ({ value: location, label: location })),
      value: filters.location,
      onChange: (value: string) => updateFilter('location', value)
    }
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredEquipment.map((item) => (
        <Card key={item.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <p className="text-sm text-slate-600">{item.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} variant="equipment" />
                <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}>
                  <Edit size={16} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Location:</span>
                <span className="text-sm font-medium">{item.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Room:</span>
                <span className="text-sm font-medium">{item.room}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Serial:</span>
                <span className="text-sm font-medium">{item.serialNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">TMAX:</span>
                <span className="text-sm font-medium">{item.tmaxConnection || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Last Service:</span>
                <span className="text-sm font-medium">{item.lastService}</span>
              </div>
              
              {(item.equipmentPhoto || item.documentation || item.warrantyDocumentation || item.roomLayout || item.roomPhoto) && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-slate-500 mb-2">Media & Documents:</p>
                  <div className="flex gap-2 flex-wrap">
                    {item.equipmentPhoto && (
                      <Badge variant="outline" className="text-xs">
                        <Image size={12} className="mr-1" />
                        Equipment
                      </Badge>
                    )}
                    {item.documentation && item.documentation.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <FileText size={12} className="mr-1" />
                        Docs ({item.documentation.length})
                      </Badge>
                    )}
                    {item.warrantyDocumentation && item.warrantyDocumentation.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        <Shield size={12} className="mr-1" />
                        Warranty ({item.warrantyDocumentation.length})
                      </Badge>
                    )}
                    {item.roomLayout && (
                      <Badge variant="outline" className="text-xs">
                        <Layout size={12} className="mr-1" />
                        Layout
                      </Badge>
                    )}
                    {item.roomPhoto && (
                      <Badge variant="outline" className="text-xs">
                        <Image size={12} className="mr-1" />
                        Room
                      </Badge>
                    )}
                  </div>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <p className="text-xs text-slate-500">Warranty: {item.warranty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Wrench size={24} />
            <div>
              <h2 className="text-xl font-bold">Equipment Management</h2>
              <p className="text-blue-100">Monitor and manage all equipment across locations</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <AddEquipmentDialog />
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search equipment, location, or type..."
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
          onEdit={handleEdit}
        />
      )}

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <Wrench size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">No equipment found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <EditEquipmentDialog
        equipment={editingEquipment}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onUpdateEquipment={handleUpdateEquipment}
      />
    </div>
  );
};

export default EquipmentManagement;
