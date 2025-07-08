import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { useTickets } from '@/hooks/useTickets';
import { TicketFilters } from '@/components/tickets/TicketFilters';
import { CreateTicketDialog } from '@/components/tickets/CreateTicketDialog';
import { TicketDetailsDialog } from '@/components/tickets/TicketDetailsDialog';
import { TicketsTable } from '@/components/tickets/TicketsTable';
import { TicketWithDetails, TicketFilters as ITicketFilters } from '@/types/Ticket';

const Tickets: React.FC = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketWithDetails | null>(null);
  const [filters, setFilters] = useState<ITicketFilters>({});

  const { tickets, loading, createTicket, updateTicket, fetchTickets } = useTickets();

  const handleFiltersChange = (newFilters: ITicketFilters) => {
    setFilters(newFilters);
    fetchTickets(newFilters);
  };

  const handleTicketClick = (ticket: TicketWithDetails) => {
    setSelectedTicket(ticket);
    setDetailsDialogOpen(true);
  };

  const handleStatusUpdate = async (ticketId: string, status: string) => {
    await updateTicket({ id: ticketId, status: status as any });
    // Refresh the selected ticket details
    const updatedTicket = tickets.find(t => t.id === ticketId);
    if (updatedTicket) {
      setSelectedTicket(updatedTicket);
    }
  };

  const filteredTickets = tickets;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tickets</h1>
          <p className="text-muted-foreground">
            Manage maintenance and service tickets
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Ticket
        </Button>
      </div>

      <TicketFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TicketsTable
            tickets={filteredTickets}
            onTicketClick={handleTicketClick}
            loading={loading}
          />
        </CardContent>
      </Card>

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSubmit={async (data) => {
          await createTicket(data);
        }}
      />

      <TicketDetailsDialog
        ticket={selectedTicket}
        open={detailsDialogOpen}
        onOpenChange={setDetailsDialogOpen}
        onUpdateStatus={handleStatusUpdate}
      />
    </div>
  );
};

export default Tickets;