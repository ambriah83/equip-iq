import React, { useState } from 'react';
import { Building2, MapPin, Users, Edit, Home, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDataFiltering } from '@/shared/hooks/useDataFiltering';
import { useViewToggle } from '@/shared/hooks/useViewToggle';
import { useLocations, Location } from '@/shared/hooks/useLocations';
import { useSupabaseRooms } from '@/shared/hooks/useSupabaseRooms';
import { DataTable, FilterBar, StatusBadge } from '@/shared/components/common';
import { LocationCard, AddLocationDialog, LocationDetailsModal, LocationImportDialog } from './location';
import { AddRoomDialog } from './room';
import { Database } from '@/integrations/supabase/types';
import { ViewToggle } from '@/shared/components/forms/ViewToggle';

type DatabaseLocation = Database['public']['Tables']['locations']['Row'];

const LocationManagement = () => {
  const { view, setView } = useViewToggle();
  const { locations, loading, createLocation, updateLocation, deleteLocation } = useLocations();
  const { rooms } = useSupabaseRooms();
  const [selectedLocation, setSelectedLocation] = useState<DatabaseLocation | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'manage'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

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
    searchFields: ['name', 'address', 'manager_name', 'abbreviation'],
    filterConfigs: {
      status: 'Status'
    }
  });

  const handleViewDetails = (location: DatabaseLocation) => {
    setSelectedLocation(location);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleManage = (location: DatabaseLocation) => {
    setSelectedLocation(location);
    setModalMode('manage');
    setIsModalOpen(true);
  };

  const handleLocationUpdate = async (updatedLocation: DatabaseLocation) => {
    try {
      await updateLocation(updatedLocation.id, updatedLocation);
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLocation(null);
  };

  const handleLocationsImported = () => {
    // Refresh the locations data
    window.location.reload(); // Simple refresh for now
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
      key: 'manager_name',
      label: 'Manager'
    },
    {
      key: 'rooms',
      label: 'Rooms',
      render: (location: Location) => (
        <div className="flex items-center gap-1">
          <Home size={14} />
          <span>{rooms.filter(room => room.location_id === location.id).length}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (location: Location) => (
        <StatusBadge status={location.status} variant="location" />
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (location: Location) => (
        <span>{new Date(location.created_at).toLocaleDateString()}</span>
      )
    }
  ];

  const renderActions = (location: Location) => {
    // Convert Location to DatabaseLocation for actions
    const dbLocation: DatabaseLocation = {
      ...location,
      status: location.status
    };
    
    return (
      <div className="flex gap-1">
        <Button size="sm" variant="outline" onClick={() => handleViewDetails(dbLocation)}>
          View
        </Button>
        <Button size="sm" onClick={() => handleManage(dbLocation)}>
          <Edit size={16} />
        </Button>
      </div>
    );
  };

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
      {filteredLocations.map((location) => {
        // Convert Location to DatabaseLocation for the card
        const dbLocation: DatabaseLocation = {
          ...location,
          status: location.status
        };
        
        return (
          <LocationCard
            key={location.id}
            location={dbLocation}
            onViewDetails={handleViewDetails}
            onManage={handleManage}
            roomCount={rooms.filter(room => room.location_id === location.id).length}
          />
        );
      })}
    </div>
  );

  if (loading) {
    return <div className="p-6">Loading locations...</div>;
  }

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
            <button
              onClick={() => setIsImportDialogOpen(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Upload size={16} />
              Import
            </button>
            <AddRoomDialog locations={locations.map(loc => ({ ...loc, status: loc.status }))} />
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
          onEdit={(location) => {
            const dbLocation: DatabaseLocation = {
              ...location,
              status: location.status
            };
            handleManage(dbLocation);
          }}
          actions={renderActions}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Quick Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{locations.length}</p>
              <p className="text-sm text-slate-600">Total Locations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{rooms.length}</p>
              <p className="text-sm text-slate-600">Total Rooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-sm text-slate-600">Active Issues</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <LocationImportDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onLocationsImported={handleLocationsImported}
      />

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