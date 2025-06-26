
import { useState, useMemo } from 'react';

interface FilterConfig {
  [key: string]: string;
}

interface UseDataFilteringProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterConfigs?: FilterConfig;
}

export function useDataFiltering<T>({ 
  data, 
  searchFields, 
  filterConfigs = {} 
}: UseDataFilteringProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize filters with the provided default values instead of 'all'
  const [filters, setFilters] = useState<FilterConfig>(filterConfigs);
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search filter
      const matchesSearch = searchTerm === '' || searchFields.some(field => {
        const value = item[field];
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });

      // Custom filters
      const matchesFilters = Object.entries(filters).every(([filterKey, filterValue]) => {
        if (filterValue === 'all') return true;
        return String(item[filterKey as keyof T]) === filterValue;
      });

      return matchesSearch && matchesFilters;
    });
  }, [data, searchTerm, filters, searchFields]);

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters(Object.keys(filterConfigs).reduce((acc, key) => {
      acc[key] = 'all';
      return acc;
    }, {} as FilterConfig));
  };

  const hasActiveFilters = searchTerm !== '' || Object.entries(filters).some(([key, value]) => {
    const defaultValue = filterConfigs[key] || 'all';
    return value !== defaultValue && value !== 'all';
  });

  return {
    searchTerm,
    setSearchTerm,
    filters,
    updateFilter,
    showFilters,
    setShowFilters,
    filteredData,
    clearAllFilters,
    hasActiveFilters
  };
}
