import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TicketWithDetails } from '@/types/Ticket';
import { format } from 'date-fns';

interface TicketsTableProps {
  tickets: TicketWithDetails[];
  onTicketClick: (ticket: TicketWithDetails) => void;
  loading?: boolean;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  onTicketClick,
  loading = false
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white hover:bg-red-600';
      case 'high': return 'bg-orange-500 text-white hover:bg-orange-600';
      case 'medium': return 'bg-yellow-500 text-white hover:bg-yellow-600';
      case 'low': return 'bg-green-500 text-white hover:bg-green-600';
      default: return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500 text-white hover:bg-blue-600';
      case 'in_progress': return 'bg-purple-500 text-white hover:bg-purple-600';
      case 'resolved': return 'bg-green-500 text-white hover:bg-green-600';
      case 'closed': return 'bg-gray-500 text-white hover:bg-gray-600';
      default: return 'bg-gray-500 text-white hover:bg-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Loading tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No tickets found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Created Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id} className="cursor-pointer hover:bg-muted/50">
              <TableCell>
                <Button
                  variant="link"
                  className="p-0 h-auto font-medium text-left justify-start"
                  onClick={() => onTicketClick(ticket)}
                >
                  {ticket.title}
                </Button>
                {ticket.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {ticket.description}
                  </p>
                )}
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>
                {ticket.equipment?.name || (
                  <span className="text-muted-foreground">No equipment</span>
                )}
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{ticket.location?.name}</p>
                  {ticket.room && (
                    <p className="text-sm text-muted-foreground">{ticket.room.name}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(ticket.created_at), 'MMM dd, yyyy')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};