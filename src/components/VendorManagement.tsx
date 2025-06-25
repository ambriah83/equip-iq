import React, { useState } from 'react';
import { Package, Edit, Phone, MessageSquare, Star, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useSettings } from '@/contexts/SettingsContext';
import { useDataFiltering } from '@/hooks/useDataFiltering';
import { useViewToggle } from '@/hooks/useViewToggle';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DataTable, FilterBar } from '@/components/shared';
import { VendorCard, AddVendorDialog, EditVendorDialog, VendorChatbot } from '@/components/vendor';
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

const VendorManagement = () => {
  const { view, setView } = useViewToggle();
  const { settings } = useSettings();
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const [vendors, setVendors] = useLocalStorage<Vendor[]>('vendors', [
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
      communicationLog: [{
        id: '1',
        type: 'call',
        date: '2024-01-20',
        duration: '15 min',
        notes: 'Discussed electrical issue in bed #3',
        issueId: 'eq-001'
      }]
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

  const {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    showFilters,
    setShowFilters,
    filteredData: filteredVendors,
    clearAllFilters,
    hasActiveFilters
  } = useDataFiltering({
    data: vendors,
    searchFields: ['name', 'type', 'notes'],
    filterConfigs: {
      type: 'Type'
    }
  });

  const handleEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setShowEditDialog(true);
  };

  const handleAddVendor = (newVendor: Vendor) => {
    setVendors(prev => [...prev, newVendor]);
  };

  const handleUpdateVendor = (updatedVendor: Vendor) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === updatedVendor.id ? updatedVendor : vendor
    ));
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

  const columns = [
    {
      key: 'name',
      label: 'Name',
      render: (vendor: Vendor) => (
        <div className="font-medium">{vendor.name}</div>
      )
    },
    {
      key: 'type',
      label: 'Type',
      render: (vendor: Vendor) => (
        <Badge variant="outline">{vendor.type}</Badge>
      )
    },
    {
      key: 'phone',
      label: 'Phone'
    },
    {
      key: 'preferredContact',
      label: 'Preferred Contact',
      render: (vendor: Vendor) => (
        <div className="flex items-center gap-2">
          {getPreferredContactIcon(vendor.preferredContact)}
          <span className="capitalize">{vendor.preferredContact}</span>
        </div>
      )
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (vendor: Vendor) => (
        <div className="flex items-center gap-1">
          {renderStars(vendor.rating, vendor.id, true)}
        </div>
      )
    },
    {
      key: 'isFirstChoice',
      label: 'Top Choice',
      render: (vendor: Vendor) => (
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
      )
    },
    {
      key: 'lastContacted',
      label: 'Last Contacted'
    }
  ];

  const renderActions = (vendor: Vendor) => (
    <div className="flex gap-1">
      <Button size="sm" variant="ghost" onClick={() => handleCall(vendor)}>
        <Phone size={16} />
      </Button>
      <Button size="sm" variant="ghost" onClick={() => handleText(vendor)}>
        <MessageSquare size={16} />
      </Button>
      <Button size="sm" variant="ghost" onClick={() => handleEmail(vendor)}>
        <Mail size={16} />
      </Button>
    </div>
  );

  const filterConfigs = [
    {
      key: 'type',
      label: 'Type',
      options: settings.vendorTypes.map(type => ({ value: type, label: type })),
      value: filters.type,
      onChange: (value: string) => updateFilter('type', value)
    }
  ];

  const renderCardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredVendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onEdit={handleEdit}
          onCall={handleCall}
          onText={handleText}
          onEmail={handleEmail}
          onToggleFirstChoice={toggleFirstChoice}
          renderStars={renderStars}
          getPreferredContactIcon={getPreferredContactIcon}
        />
      ))}
    </div>
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
            <AddVendorDialog onAddVendor={handleAddVendor} />
          </div>
        </div>
      </div>

      <FilterBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search vendors by name, type, or notes..."
        filters={filterConfigs}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearAll={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredVendors.length}
        totalCount={vendors.length}
      />

      {view === 'card' ? renderCardView() : (
        <DataTable
          data={filteredVendors}
          columns={columns}
          onEdit={handleEdit}
          actions={renderActions}
        />
      )}

      {filteredVendors.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-2">
            <Package size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-600 mb-2">No vendors found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}

      <EditVendorDialog
        vendor={editingVendor}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onUpdateVendor={handleUpdateVendor}
      />

      <VendorChatbot />
    </div>
  );
};

export default VendorManagement;
