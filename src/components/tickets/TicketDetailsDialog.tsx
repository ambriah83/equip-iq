import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { TicketWithDetails } from '@/types/Ticket';
import { format } from 'date-fns';

interface TicketDetailsDialogProps {
  ticket: TicketWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateStatus: (ticketId: string, status: string) => Promise<void>;
}

export const TicketDetailsDialog: React.FC<TicketDetailsDialogProps> = ({
  ticket,
  open,
  onOpenChange,
  onUpdateStatus
}) => {
  const [updating, setUpdating] = useState(false);

  if (!ticket) return null;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500 text-white';
      case 'in_progress': return 'bg-purple-500 text-white';
      case 'resolved': return 'bg-green-500 text-white';
      case 'closed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      setUpdating(true);
      await onUpdateStatus(ticket.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {ticket.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Priority */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={getPriorityColor(ticket.priority)}>
                {ticket.priority.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(ticket.status)}>
                {ticket.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="status-select">Update Status:</Label>
              <Select
                value={ticket.status}
                onValueChange={handleStatusUpdate}
                disabled={updating}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Ticket Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Location</Label>
                <p className="mt-1">{ticket.location?.name || 'N/A'}</p>
              </div>

              {ticket.room && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Room</Label>
                  <p className="mt-1">{ticket.room.name}</p>
                </div>
              )}

              {ticket.equipment && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Equipment</Label>
                  <p className="mt-1">{ticket.equipment.name}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Type</Label>
                <p className="mt-1 capitalize">{ticket.ticket_type}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                <p className="mt-1">{format(new Date(ticket.created_at), 'PPp')}</p>
              </div>

              {ticket.resolved_at && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Resolved</Label>
                  <p className="mt-1">{format(new Date(ticket.resolved_at), 'PPp')}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Reported By</Label>
                <p className="mt-1">{ticket.reported_by?.email || 'N/A'}</p>
              </div>

              {ticket.assigned_to && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Assigned To</Label>
                  <p className="mt-1">{ticket.assigned_to.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {ticket.description && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="mt-2 p-4 bg-muted rounded-lg">{ticket.description}</p>
              </div>
            </>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};