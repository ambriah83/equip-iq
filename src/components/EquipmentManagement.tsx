
import React, { useState } from 'react';
import { Wrench, Plus, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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

const EquipmentManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const equipment: Equipment[] = [
    {
      id: '1',
      name: 'Tanning Bed #3',
      type: 'Tanning Equipment',
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
      type: 'Climate Control',
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
      type: 'Utilities',
      location: 'Location C',
      room: 'Utility Room',
      serialNumber: 'WH-2023-001',
      status: 'offline',
      lastService: '2023-12-20',
      warranty: 'Active until 2026-03-15'
    },
    {
      id: '4',
      name: 'Light Therapy Unit #2',
      type: 'Therapy Equipment',
      location: 'Location A',
      room: 'Room 7',
      serialNumber: 'LT-2023-002',
      status: 'active',
      lastService: '2024-01-20',
      warranty: 'Active until 2025-12-31'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEquipment = equipment.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Button className="bg-white text-blue-600 hover:bg-blue-50">
            <Plus size={20} className="mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

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
        <Button variant="outline">
          <Filter size={20} className="mr-2" />
          Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <p className="text-sm text-slate-600">{item.type}</p>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
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
    </div>
  );
};

export default EquipmentManagement;
