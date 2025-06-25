import React, { useState } from 'react';
import { Building2, MapPin, Users, Edit, Home } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useRooms } from '@/hooks/useRooms';
import { DataTable, FilterBar, StatusBadge } from '@/components/shared';
import { LocationCard, AddLocationDialog, LocationDetailsModal } from '@/components/location';
import { AddRoomDialog } from '@/components/room';
import { Location } from '@/types/Location';
import ViewToggle from './ViewToggle';

const LocationManagement = () => {
  const { view, setView } = useViewToggle();
  const { rooms } = useRooms();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'manage'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [locations, setLocations] = useLocalStorage<Location[]>('locations', [
    {
      id: '1',
      name: 'Sunshine Tanning - Downtown',
      address: '123 Main St, City, State 12345',
      manager: 'Sarah Johnson',
      equipmentCount: 12,
      activeIssues: 2,
      status: 'active',
      lastUpdated: '2024-01-25',
      abbreviation: 'CA'
    },
    {
      id: '2',
      name: 'Golden Glow - Westside',
      address: '456 Oak Ave, City, State 12345',
      manager: 'Mike Chen',
      equipmentCount: 8,
      activeIssues: 0,
      status: 'active',
      lastUpdated: '2024-01-24',
      abbreviation: 'FL'
    },
    {
      id: '3',
      name: 'Radiant Wellness - North',
      address: '789 Pine Blvd, City, State 12345',
      manager: 'Emily Davis',
      equipmentCount: 15,
      activeIssues: 1,
      status: 'maintenance',
      lastUpdated: '2024-01-23',
      abbreviation: 'TX'
    }
  ]);

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    showFilters,
    setShowFilters,
    filteredData: filteredLocations,
    clearAllFilters,
    hasActiveFilters
  } = useDataFiltering({
    data: locations,
    searchFields: ['name', 'address', 'manager', 'abbreviation'],
    filterConfigs: {
      status: 'Status'
    }
  });

  const handleViewDetails = (location: Location) => {
    setSelectedLocation(location);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleManage = (location: Location) => {
    setSelectedLocation(location);
    setModalMode('manage');
    setIsModalOpen(true);
  };

  const handleLocationUpdate = (updatedLocation: Location) => {
    setLocations(prevLocations => 
      prevLocations.map(loc => 
        loc.id === updatedLocation.id ? updatedLocation : loc
      )
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (location: Location) => (
        <div>
          <div className="font-medium flex items-center gap-2">
            {location.name}
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {location.abbreviation}
            </span>
          </div>
          <div className="text-sm text-slate-600 flex items-center gap-1">
            <MapPin size={12} />
            {location.address}
          </div>
        </div>
      )
    },
    {
      key: 'manager',
      label: 'Manager'
    },
    {
      key: 'equipmentCount',
      label: 'Equipment'
    },
    {
      key: 'rooms',
      label: 'Rooms',
      render: (location: Location) => (
        <div className="flex items-center gap-1">
          <Home size={14} />
          <span>{rooms.filter(room => room.locationId === location.id).length}</span>
        </div>
      )
    },
    {
      key: 'activeIssues',
      label: 'Issues'
    },
    {
      key: 'status',
      label: 'Status',
      render: (location: Location) => (
        <StatusBadge status={location.status} variant="location" />
      )
    },
    {
      key: 'lastUpdated',
      label: 'Last Updated'
    }
  ];

  const renderActions = (location: Location) => (
    <div className="flex gap-1">
      <Button size="sm" variant="outline" onClick={() => handleViewDetails(location)}>
        View
      </Button>
      <Button size="sm" onClick={() => handleManage(location)}>
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
        { value: 'closed', label: 'Closed' }
      ],
      value: filters.status,
      onChange: (value: string) => updateFilter('status', value)
    }
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredLocations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
          onViewDetails={handleViewDetails}
          onManage={handleManage}
          roomCount={rooms.filter(room => room.locationId === location.id).length}
        />
      ))}
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 size={24} />
            <div>
              <h2 className="text-xl font-bold">Location Management</h2>
              <p className="text-blue-100">Manage all franchise locations and their details</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <AddRoomDialog locations={locations} />
            <AddLocationDialog />
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search locations by name, address, manager, or abbreviation..."
        filters={filterConfigs}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredLocations.length}
        totalCount={locations.length}
      />

      {view === 'card' ? renderCardView() : (
        <DataTable
          data={filteredLocations}
          columns={columns}
          onEdit={handleManage}
          actions={renderActions}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
              <p className="text-sm text-slate-600">Total Locations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{rooms.length}</p>
              <p className="text-sm text-slate-600">Total Rooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {locations.reduce((sum, loc) => sum + loc.equipmentCount, 0)}
              </p>
              <p className="text-sm text-slate-600">Total Equipment</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {locations.reduce((sum, loc) => sum + loc.activeIssues, 0)}
              </p>
              <p className="text-sm text-slate-600">Active Issues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <LocationDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        location={selectedLocation}
        mode={modalMode}
        onLocationUpdate={handleLocationUpdate}
      />
    </div>
  );
};

export default LocationManagement;
