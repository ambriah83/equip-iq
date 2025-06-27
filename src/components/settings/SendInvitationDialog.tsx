
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useUserInvitations } from '@/hooks/useUserInvitations';
import { useLocations } from '@/hooks/useLocations';

interface SendInvitationDialogProps {
  onClose: () => void;
}

const SendInvitationDialog: React.FC<SendInvitationDialogProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'franchisee' | 'tech' | 'employee'>('employee');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { sendInvitation } = useUserInvitations();
  const { locations } = useLocations();

  const handleLocationToggle = (locationId: string, checked: boolean) => {
    if (checked) {
      setSelectedLocations(prev => [...prev, locationId]);
    } else {
      setSelectedLocations(prev => prev.filter(id => id !== locationId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const success = await sendInvitation(email, role, selectedLocations);
    setLoading(false);

    if (success) {
      onClose();
    }
  };

  return (
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Send Team Invitation</DialogTitle>
        <DialogDescription>
          Invite someone to join your team on EquipIQ. They'll receive an email with instructions to create their account.
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="sarah@example.com"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="role">Role</Label>
          <Select value={role} onValueChange={(value: 'admin' | 'manager' | 'franchisee' | 'tech' | 'employee') => setRole(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Employee</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="franchisee">Franchisee</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Location Access</Label>
          <div className="mt-2 space-y-2 max-h-40 overflow-y-auto border rounded-md p-3">
            {locations.map((location) => (
              <div key={location.id} className="flex items-center space-x-2">
                <Checkbox
                  id={location.id}
                  checked={selectedLocations.includes(location.id)}
                  onCheckedChange={(checked) => handleLocationToggle(location.id, checked as boolean)}
                />
                <Label htmlFor={location.id} className="text-sm font-normal">
                  {location.name}
                </Label>
              </div>
            ))}
            {locations.length === 0 && (
              <p className="text-sm text-gray-500">No locations available</p>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Select which locations this user should have access to
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Invitation'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SendInvitationDialog;
