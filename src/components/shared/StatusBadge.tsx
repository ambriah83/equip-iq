
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'equipment' | 'vendor' | 'location';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, variant = 'default' }) => {
  const getStatusColor = (status: string, variant: string) => {
    if (variant === 'equipment') {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'maintenance': return 'bg-yellow-100 text-yellow-800';
        case 'offline': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else if (variant === 'location') {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'maintenance': return 'bg-yellow-100 text-yellow-800';
        case 'closed': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (status) {
        case 'active': return 'bg-green-100 text-green-800';
        case 'inactive': return 'bg-red-100 text-red-800';
        case 'pending': return 'bg-yellow-100 text-yellow-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <Badge className={getStatusColor(status, variant)}>
      {status}
    </Badge>
  );
};

export default StatusBadge;
