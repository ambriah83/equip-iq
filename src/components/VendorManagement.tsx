
import React, { useState } from 'react';
import { Package, Search, Filter, X, Edit, Phone, MessageSquare, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import ViewToggle from './ViewToggle';

interface Vendor {
  id: string;
  name: string;
  type: 'electrician' | 'plumber' | 'handyman';
  phone: string;
  email: string;
  address: string;
  notes: string;
  isFirstChoice: boolean;
  rating: number;
  lastContacted: string;
}

const VENDOR_TYPES = ['electrician', 'plumber', 'handyman'];

const VendorManagement = () => {
  const [view, setView] = useState<'card' | 'list'>('card');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [vendors, setVendors] = useState<Vendor[]>([
    {
      id: '1',
      name: 'Elite Electric Services',
      type: 'electrician',
      phone: '+1 (555) 123-4567',
      email: 'contact@eliteelectric.com',
      address: '123 Industrial Blvd, City, State 12345',
      notes: 'Excellent work on tanning bed electrical systems. Very reliable and prompt.',
      isFirstChoice: true,
      rating: 5,
      lastContacted: '2024-01-20'
    },
    {
      id: '2',
      name: 'Quick Fix Plumbing',
      type: 'plumber',
      phone: '+1 (555) 987-6543',
      email: 'service@quickfixplumbing.com',
      address: '456 Service Ave, City, State 12345',
      notes: 'Good for emergency repairs. Available 24/7.',
      isFirstChoice: false,
      rating: 4,
      lastContacted: '2024-01-15'
    },
    {
      id: '3',
      name: 'All-Around Handyman Co.',
      type: 'handyman',
      phone: '+1 (555) 456-7890',
      email: 'info@allaroundhandyman.com',
      address: '789 Repair St, City, State 12345',
      notes: 'Great for general maintenance and small repairs.',
      isFirstChoice: true,
      rating: 4,
      lastContacted: '2024-01-18'
    }
  ]);

  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || vendor.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const clearAllFilters = () => {
    setTypeFilter('all');
    setSearchTerm('');
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const toggleFirstChoice = (id: string) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === id ? { ...vendor, isFirstChoice: !vendor.isFirstChoice } : vendor
    ));
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleText = (phone: string) => {
    window.open(`sms:${phone}`);
  };

  const hasActiveFilters = typeFilter !== 'all' || searchTerm !== '';

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
      />
    ));
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVendors.map((vendor) => (
        <Card key={vendor.id} className="hover:shadow-lg transition-shadow relative">
          {vendor.isFirstChoice && (
            <div className="absolute top-2 right-2 z-10">
              <Star className="fill-yellow-400 text-yellow-400" size={20} />
            </div>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">{vendor.name}</CardTitle>
                <Badge variant="outline" className="mb-2">
                  {vendor.type}
                </Badge>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(vendor.rating)}
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleEdit(vendor.id)}
              >
                <Edit size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-slate-600">Contact</p>
                <p className="text-sm font-medium">{vendor.phone}</p>
                <p className="text-sm text-slate-600">{vendor.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Address</p>
                <p className="text-sm font-medium">{vendor.address}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Notes</p>
                <p className="text-sm">{vendor.notes}</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-slate-500">Last contacted: {vendor.lastContacted}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleCall(vendor.phone)}
                >
                  <Phone size={16} className="mr-1" />
                  Call
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleText(vendor.phone)}
                >
                  <MessageSquare size={16} className="mr-1" />
                  Text
                </Button>
                <Button
                  size="sm"
                  variant={vendor.isFirstChoice ? "default" : "outline"}
                  onClick={() => toggleFirstChoice(vendor.id)}
                >
                  <Star size={16} />
                </Button>
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
              <TableHead>Phone</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>First Choice</TableHead>
              <TableHead>Last Contacted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{vendor.type}</Badge>
                </TableCell>
                <TableCell>{vendor.phone}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {renderStars(vendor.rating)}
                  </div>
                </TableCell>
                <TableCell>
                  {vendor.isFirstChoice && (
                    <Star className="fill-yellow-400 text-yellow-400" size={16} />
                  )}
                </TableCell>
                <TableCell>{vendor.lastContacted}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCall(vendor.phone)}
                    >
                      <Phone size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleText(vendor.phone)}
                    >
                      <MessageSquare size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(vendor.id)}
                    >
                      <Edit size={16} />
                    </Button>
                  </div>
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
            <Package size={24} />
            <div>
              <h2 className="text-xl font-bold">Vendor Management</h2>
              <p className="text-blue-100">Manage supplier relationships and vendor information</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ViewToggle view={view} onViewChange={setView} />
            <Button>Add Vendor</Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search vendors by name, type, or notes..."
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {VENDOR_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {view === 'card' ? renderCardView() : renderListView()}

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <Package size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">No vendors found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default VendorManagement;
