
import React, { useState } from 'react';
import { Package, Search, Filter, X, Edit, Phone, MessageSquare, Star, Mail, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import ViewToggle from './ViewToggle';

interface CommunicationLog {
  id: string;
  type: 'call' | 'text' | 'email';
  date: string;
  duration?: string;
  notes: string;
  issueId?: string;
}

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
  preferredContact: 'phone' | 'text' | 'email';
  communicationLog: CommunicationLog[];
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
      lastContacted: '2024-01-20',
      preferredContact: 'phone',
      communicationLog: [
        {
          id: '1',
          type: 'call',
          date: '2024-01-20',
          duration: '15 min',
          notes: 'Discussed electrical issue in bed #3',
          issueId: 'eq-001'
        }
      ]
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
      lastContacted: '2024-01-15',
      preferredContact: 'email',
      communicationLog: []
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
      lastContacted: '2024-01-18',
      preferredContact: 'text',
      communicationLog: []
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

  const logCommunication = (vendorId: string, type: 'call' | 'text' | 'email', contact: string) => {
    const newLog: CommunicationLog = {
      id: Date.now().toString(),
      type,
      date: new Date().toISOString().split('T')[0],
      notes: `${type} to ${contact}`,
      duration: type === 'call' ? 'Unknown' : undefined
    };

    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId 
        ? { 
            ...vendor, 
            communicationLog: [newLog, ...vendor.communicationLog],
            lastContacted: newLog.date
          }
        : vendor
    ));
  };

  const handleCall = (vendor: Vendor) => {
    window.open(`tel:${vendor.phone}`);
    logCommunication(vendor.id, 'call', vendor.phone);
  };

  const handleText = (vendor: Vendor) => {
    window.open(`sms:${vendor.phone}`);
    logCommunication(vendor.id, 'text', vendor.phone);
  };

  const handleEmail = (vendor: Vendor) => {
    window.open(`mailto:${vendor.email}`);
    logCommunication(vendor.id, 'email', vendor.email);
  };

  const updateVendorRating = (vendorId: string, newRating: number) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId ? { ...vendor, rating: newRating } : vendor
    ));
  };

  const hasActiveFilters = typeFilter !== 'all' || searchTerm !== '';

  const getPreferredContactIcon = (preferredContact: string) => {
    switch (preferredContact) {
      case 'phone': return <Phone size={14} className="text-blue-600" />;
      case 'text': return <MessageSquare size={14} className="text-green-600" />;
      case 'email': return <Mail size={14} className="text-orange-600" />;
      default: return <Phone size={14} className="text-gray-600" />;
    }
  };

  const renderStars = (rating: number, vendorId?: string, editable: boolean = false) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${editable ? 'cursor-pointer hover:text-yellow-400' : ''}`}
        onClick={editable && vendorId ? () => updateVendorRating(vendorId, i + 1) : undefined}
      />
    ));
  };

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVendors.map((vendor) => (
        <Card key={vendor.id} className="hover:shadow-lg transition-shadow relative">
          {vendor.isFirstChoice && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-2 right-2 z-10">
                    <Star className="fill-yellow-400 text-yellow-400" size={20} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Top Choice Vendor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1">{vendor.name}</CardTitle>
                <Badge variant="outline" className="mb-2">
                  {vendor.type}
                </Badge>
                <div className="flex items-center gap-1 mb-2">
                  {renderStars(vendor.rating, vendor.id, true)}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-slate-600">Preferred:</span>
                  {getPreferredContactIcon(vendor.preferredContact)}
                  <span className="text-sm capitalize">{vendor.preferredContact}</span>
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
              {vendor.communicationLog.length > 0 && (
                <div>
                  <p className="text-sm text-slate-600">Recent Contact</p>
                  <p className="text-xs text-slate-500">
                    {vendor.communicationLog[0].type} on {vendor.communicationLog[0].date}
                  </p>
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-slate-500">Last contacted: {vendor.lastContacted}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleCall(vendor)}
                >
                  <Phone size={16} className="mr-1" />
                  Call
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleText(vendor)}
                >
                  <MessageSquare size={16} className="mr-1" />
                  Text
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleEmail(vendor)}
                >
                  <Mail size={16} className="mr-1" />
                  Email
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant={vendor.isFirstChoice ? "default" : "outline"}
                        onClick={() => toggleFirstChoice(vendor.id)}
                      >
                        <Star size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{vendor.isFirstChoice ? 'Remove from Top Choice' : 'Make Top Choice'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
              <TableHead>Preferred Contact</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Top Choice</TableHead>
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
                  <div className="flex items-center gap-2">
                    {getPreferredContactIcon(vendor.preferredContact)}
                    <span className="capitalize">{vendor.preferredContact}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {renderStars(vendor.rating, vendor.id, true)}
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          {vendor.isFirstChoice && (
                            <Star className="fill-yellow-400 text-yellow-400" size={16} />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Top Choice Vendor</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{vendor.lastContacted}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCall(vendor)}
                    >
                      <Phone size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleText(vendor)}
                    >
                      <MessageSquare size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEmail(vendor)}
                    >
                      <Mail size={16} />
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
