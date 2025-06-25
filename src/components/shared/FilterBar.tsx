
import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterConfig {
  key: string;
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  showFilters: boolean;
  onToggleFilters: () => void;
  onClearAll: () => void;
  hasActiveFilters: boolean;
  resultCount?: number;
  totalCount?: number;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters = [],
  showFilters,
  onToggleFilters,
  onClearAll,
  hasActiveFilters,
  resultCount,
  totalCount
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
        {filters.length > 0 && (
          <Button 
            variant="outline" 
            onClick={onToggleFilters}
            className={showFilters ? 'bg-blue-50 border-blue-300' : ''}
          >
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        )}
        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearAll}>
            <X size={20} className="mr-2" />
            Clear
          </Button>
        )}
      </div>

      {showFilters && filters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-lg">
          {filters.map((filter) => (
            <div key={filter.key}>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {filter.label}
              </label>
              <Select value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={`All ${filter.label.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      )}

      {hasActiveFilters && resultCount !== undefined && totalCount !== undefined && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Showing {resultCount} of {totalCount} items</span>
          <div className="flex gap-2">
            {filters.map((filter) => 
              filter.value !== 'all' && (
                <Badge key={filter.key} variant="secondary" className="text-xs">
                  {filter.label}: {filter.options.find(opt => opt.value === filter.value)?.label || filter.value}
                </Badge>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
