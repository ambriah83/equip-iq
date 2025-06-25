
import React from 'react';
import { Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ViewToggleProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex gap-1 border rounded-lg p-1">
      <Button
        variant={view === 'card' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('card')}
        className="flex items-center gap-2"
      >
        <Grid size={16} />
        Cards
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className="flex items-center gap-2"
      >
        <List size={16} />
        List
      </Button>
    </div>
  );
};

export default ViewToggle;
