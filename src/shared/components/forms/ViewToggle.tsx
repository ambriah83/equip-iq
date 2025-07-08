import React from 'react';
import { Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  view: 'card' | 'table';
  onViewChange: (view: 'card' | 'table') => void;
  className?: string;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  view,
  onViewChange,
  className
}) => {
  return (
    <div className={cn("flex items-center gap-1 bg-slate-100 rounded-lg p-1", className)}>
      <Button
        size="sm"
        variant={view === 'card' ? 'default' : 'ghost'}
        onClick={() => onViewChange('card')}
        className={cn(
          "h-8 px-3",
          view === 'card' 
            ? "bg-white shadow-sm" 
            : "hover:bg-slate-200"
        )}
      >
        <Grid3X3 size={16} className="mr-1" />
        Cards
      </Button>
      <Button
        size="sm"
        variant={view === 'table' ? 'default' : 'ghost'}
        onClick={() => onViewChange('table')}
        className={cn(
          "h-8 px-3",
          view === 'table' 
            ? "bg-white shadow-sm" 
            : "hover:bg-slate-200"
        )}
      >
        <List size={16} className="mr-1" />
        Table
      </Button>
    </div>
  );
};

export default ViewToggle;