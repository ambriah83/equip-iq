
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, User, CreditCard, Settings as SettingsIcon, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'owner' | 'manager' | 'staff';
  status: 'active' | 'inactive';
}

interface DropdownField {
  id: string;
  label: string;
  value: string;
}

const Settings = () => {
  const { toast } = useToast();
  
  // User Management State
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@company.com', role: 'admin', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane@company.com', role: 'manager', status: 'active' },
    { id: '3', name: 'Bob Wilson', email: 'bob@company.com', role: 'staff', status: 'inactive' },
  ]);

  // Personal Information State
  const [personalInfo, setPersonalInfo] = useState({
    firstName: 'Current',
    lastName: 'User',
    email: 'user@company.com',
    phone: '+1 (555) 123-4567',
    company: 'Operations Hub Inc.',
    position: 'Operations Manager'
  });

  // Billing Information State
  const [billingInfo, setBillingInfo] = useState({
    plan: 'Professional',
    billingEmail: 'billing@company.com',
    cardLast4: '4242',
    nextBilling: '2024-01-15'
  });

  // Equipment Dropdown Fields State
  const [equipmentFields, setEquipmentFields] = useState({
    types: [
      { id: '1', label: 'HVAC System', value: 'hvac' },
      { id: '2', label: 'Elevator', value: 'elevator' },
      { id: '3', label: 'Fire Safety', value: 'fire-safety' },
      { id: '4', label: 'Security System', value: 'security' }
    ],
    statuses: [
      { id: '1', label: 'Operational', value: 'operational' },
      { id: '2', label: 'Maintenance Required', value: 'maintenance' },
      { id: '3', label: 'Out of Service', value: 'out-of-service' }
    ],
    priorities: [
      { id: '1', label: 'Low', value: 'low' },
      { id: '2', label: 'Medium', value: 'medium' },
      { id: '3', label: 'High', value: 'high' },
      { id: '4', label: 'Critical', value: 'critical' }
    ]
  });

  // Vendor Dropdown Fields State
  const [vendorFields, setVendorFields] = useState({
    types: [
      { id: '1', label: 'HVAC Contractor', value: 'hvac-contractor' },
      { id: '2', label: 'Electrical Contractor', value: 'electrical' },
      { id: '3', label: 'Plumbing Contractor', value: 'plumbing' },
      { id: '4', label: 'General Maintenance', value: 'general' }
    ],
    specialties: [
      { id: '1', label: 'Emergency Services', value: 'emergency' },
      { id: '2', label: 'Preventive Maintenance', value: 'preventive' },
      { id: '3', label: 'Installation', value: 'installation' },
      { id: '4', label: 'Repair', value: 'repair' }
    ]
  });

  // Dialog states
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isFieldDialogOpen, setIsFieldDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingField, setEditingField] = useState<{type: string, category: string, field: DropdownField | null}>({ type: '', category: '', field: null });

  const handleSavePersonalInfo = () => {
    toast({
      title: "Personal Information Updated",
      description: "Your personal information has been saved successfully.",
    });
  };

  const handleSaveBilling = () => {
    toast({
      title: "Billing Information Updated",
      description: "Your billing information has been saved successfully.",
    });
  };

  const handleSaveUser = (userData: Partial<User>) => {
    if (editingUser) {
      setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'staff',
        status: userData.status || 'active'
      };
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: "New user has been added successfully.",
      });
    }
    setIsUserDialogOpen(false);
    setEditingUser(null);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "User Removed",
      description: "User has been removed successfully.",
    });
  };

  const handleSaveField = (fieldData: { label: string; value: string }) => {
    const { type, category, field } = editingField;
    
    if (field) {
      // Edit existing field
      if (type === 'equipment') {
        setEquipmentFields(prev => ({
          ...prev,
          [category]: prev[category as keyof typeof prev].map(f => 
            f.id === field.id ? { ...f, ...fieldData } : f
          )
        }));
      } else {
        setVendorFields(prev => ({
          ...prev,
          [category]: prev[category as keyof typeof prev].map(f => 
            f.id === field.id ? { ...f, ...fieldData } : f
          )
        }));
      }
    } else {
      // Add new field
      const newField: DropdownField = {
        id: Date.now().toString(),
        ...fieldData
      };
      
      if (type === 'equipment') {
        setEquipmentFields(prev => ({
          ...prev,
          [category]: [...prev[category as keyof typeof prev], newField]
        }));
      } else {
        setVendorFields(prev => ({
          ...prev,
          [category]: [...prev[category as keyof typeof prev], newField]
        }));
      }
    }
    
    toast({
      title: field ? "Field Updated" : "Field Added",
      description: `Dropdown field has been ${field ? 'updated' : 'added'} successfully.`,
    });
    
    setIsFieldDialogOpen(false);
    setEditingField({ type: '', category: '', field: null });
  };

  const handleDeleteField = (type: string, category: string, fieldId: string) => {
    if (type === 'equipment') {
      setEquipmentFields(prev => ({
        ...prev,
        [category]: prev[category as keyof typeof prev].filter(f => f.id !== fieldId)
      }));
    } else {
      setVendorFields(prev => ({
        ...prev,
        [category]: prev[category as keyof typeof prev].filter(f => f.id !== fieldId)
      }));
    }
    
    toast({
      title: "Field Removed",
      description: "Dropdown field has been removed successfully.",
    });
  };

  return (
    <div className="p-6">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white mb-6">
        <h1 className="text-2xl font-bold mb-2">Settings</h1>
        <p className="text-blue-100">Manage your account, users, and system configuration</p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <User size={16} />
            Users
          </TabsTrigger>
          <TabsTrigger value="personal" className="flex items-center gap-2">
            <SettingsIcon size={16} />
            Personal
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard size={16} />
            Billing
          </TabsTrigger>
          <TabsTrigger value="dropdowns" className="flex items-center gap-2">
            <List size={16} />
            Dropdowns
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Add, edit, and manage user accounts</CardDescription>
                </div>
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setEditingUser(null)}>
                      <Plus size={16} className="mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <UserDialog
                    user={editingUser}
                    onSave={handleSaveUser}
                    onClose={() => setIsUserDialogOpen(false)}
                  />
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant={user.role === 'admin' ? 'default' : user.role === 'manager' ? 'secondary' : 'outline'}>
                            {user.role}
                          </Badge>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setIsUserDialogOpen(true);
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Personal Information Tab */}
        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={personalInfo.firstName}
                    onChange={(e) => setPersonalInfo({...personalInfo, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={personalInfo.lastName}
                    onChange={(e) => setPersonalInfo({...personalInfo, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={personalInfo.email}
                  onChange={(e) => setPersonalInfo({...personalInfo, email: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={personalInfo.phone}
                  onChange={(e) => setPersonalInfo({...personalInfo, phone: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={personalInfo.company}
                  onChange={(e) => setPersonalInfo({...personalInfo, company: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  value={personalInfo.position}
                  onChange={(e) => setPersonalInfo({...personalInfo, position: e.target.value})}
                />
              </div>
              <Button onClick={handleSavePersonalInfo}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your subscription and payment details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="plan">Current Plan</Label>
                <Select value={billingInfo.plan} onValueChange={(value) => setBillingInfo({...billingInfo, plan: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic">Basic - $29/month</SelectItem>
                    <SelectItem value="Professional">Professional - $99/month</SelectItem>
                    <SelectItem value="Enterprise">Enterprise - $299/month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="billingEmail">Billing Email</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={billingInfo.billingEmail}
                  onChange={(e) => setBillingInfo({...billingInfo, billingEmail: e.target.value})}
                />
              </div>
              <div>
                <Label>Payment Method</Label>
                <div className="p-3 border rounded-lg flex justify-between items-center">
                  <span>**** **** **** {billingInfo.cardLast4}</span>
                  <Button variant="outline" size="sm">Update Card</Button>
                </div>
              </div>
              <div>
                <Label>Next Billing Date</Label>
                <p className="text-sm text-gray-600">{billingInfo.nextBilling}</p>
              </div>
              <Button onClick={handleSaveBilling}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dropdown Fields Tab */}
        <TabsContent value="dropdowns">
          <div className="space-y-6">
            {/* Equipment Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Dropdown Fields</CardTitle>
                <CardDescription>Configure dropdown options for equipment management</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(equipmentFields).map(([category, fields]) => (
                  <div key={category} className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingField({ type: 'equipment', category, field: null })}
                          >
                            <Plus size={14} className="mr-1" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <FieldDialog
                          field={editingField.field}
                          onSave={handleSaveField}
                          onClose={() => setIsFieldDialogOpen(false)}
                        />
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {fields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{field.label}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingField({ type: 'equipment', category, field });
                                setIsFieldDialogOpen(true);
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteField('equipment', category, field.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Vendor Fields */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Dropdown Fields</CardTitle>
                <CardDescription>Configure dropdown options for vendor management</CardDescription>
              </CardHeader>
              <CardContent>
                {Object.entries(vendorFields).map(([category, fields]) => (
                  <div key={category} className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium capitalize">{category.replace(/([A-Z])/g, ' $1')}</h4>
                      <Dialog open={isFieldDialogOpen} onOpenChange={setIsFieldDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingField({ type: 'vendor', category, field: null })}
                          >
                            <Plus size={14} className="mr-1" />
                            Add
                          </Button>
                        </DialogTrigger>
                        <FieldDialog
                          field={editingField.field}
                          onSave={handleSaveField}
                          onClose={() => setIsFieldDialogOpen(false)}
                        />
                      </Dialog>
                    </div>
                    <div className="space-y-2">
                      {fields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between p-2 border rounded">
                          <span>{field.label}</span>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingField({ type: 'vendor', category, field });
                                setIsFieldDialogOpen(true);
                              }}
                            >
                              <Edit size={14} />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteField('vendor', category, field.id)}
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// User Dialog Component
const UserDialog = ({ user, onSave, onClose }: { user: User | null; onSave: (data: Partial<User>) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'staff' as const,
    status: user?.status || 'active' as const
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogDescription>
          {user ? 'Update user information' : 'Create a new user account'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={(value: any) => setFormData({...formData, role: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {user ? 'Update User' : 'Add User'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// Field Dialog Component
const FieldDialog = ({ field, onSave, onClose }: { field: DropdownField | null; onSave: (data: { label: string; value: string }) => void; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    label: field?.label || '',
    value: field?.value || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{field ? 'Edit Field' : 'Add New Field'}</DialogTitle>
        <DialogDescription>
          {field ? 'Update dropdown field' : 'Create a new dropdown option'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            value={formData.label}
            onChange={(e) => setFormData({...formData, label: e.target.value})}
            placeholder="Display name"
            required
          />
        </div>
        <div>
          <Label htmlFor="value">Value</Label>
          <Input
            id="value"
            value={formData.value}
            onChange={(e) => setFormData({...formData, value: e.target.value})}
            placeholder="Internal value (lowercase, no spaces)"
            required
          />
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {field ? 'Update Field' : 'Add Field'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default Settings;
