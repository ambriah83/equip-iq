
import React, { useState } from 'react';
import { Wrench, Search, Filter, X, Edit, Save, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddEquipmentDialog from './AddEquipmentDialog';
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
}

const EQUIPMENT_TYPES = ['Sun', 'Spray', 'Spa', 'Red Light', 'Other', 'HVAC', 'Washer', 'Dryer'];

const EquipmentManagement = () => {
  const [view, setView] = useState<'card' | 'list'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Tanning Bed #3',
      type: 'Sun',
      location: 'Location A',
      room: 'Room 3',
      serialNumber: 'TB-2023-003',
      status: 'active',
      lastService: '2024-01-15',
      warranty: 'Active until 2025-06-30'
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
      warranty: 'Expired'
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
      warranty: 'Active until 2026-03-15'
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
      warranty: 'Active until 2025-12-31'
    }
  ]);

  // Get unique values for filter options
  const uniqueTypes = [...new Set(equipment.map(item => item.type))];
  const uniqueLocations = [...new Set(equipment.map(item => item.location))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesLocation = locationFilter === 'all' || item.location === locationFilter;

    return matchesSearch && matchesStatus && matchesType && matchesLocation;
  });

  const clearAllFilters = () => {
    setStatusFilter('all');
    setTypeFilter('all');
    setLocationFilter('all');
    setSearchTerm('');
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, updatedData: Partial<Equipment>) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
    setEditingId(null);
  };

  const hasActiveFilters = statusFilter !== 'all' || typeFilter !== 'all' || locationFilter !== 'all' || searchTerm !== '';

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
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(item.id)}
                >
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
                <span className="text-sm text-slate-600">Last Service:</span>
                <span className="text-sm font-medium">{item.lastService}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-slate-500">Warranty: {item.warranty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Service</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEquipment.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell>{item.room}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status)}>
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>{item.lastService}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(item.id)}
                  >
                    <Edit size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
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

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search equipment, location, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? 'bg-blue-50 border-blue-300' : ''}
          >
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearAllFilters}>
              <X size={20} className="mr-2" />
              Clear
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="offline">Offline</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {uniqueLocations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Showing {filteredEquipment.length} of {equipment.length} items</span>
            <div className="flex gap-2">
              {statusFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Status: {statusFilter}
                </Badge>
              )}
              {typeFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Type: {typeFilter}
                </Badge>
              )}
              {locationFilter !== 'all' && (
                <Badge variant="secondary" className="text-xs">
                  Location: {locationFilter}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {view === 'card' ? renderCardView() : renderListView()}

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <Filter size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">No equipment found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;
