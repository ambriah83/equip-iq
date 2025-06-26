
export const getEquipmentFilterConfigs = (filters: any, updateFilter: (key: string, value: string) => void) => [
  {
    key: 'status',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'maintenance', label: 'Maintenance' },
      { value: 'offline', label: 'Offline' }
    ],
    value: filters.status,
    onChange: (value: string) => updateFilter('status', value)
  },
  {
    key: 'warranty_status',
    label: 'Warranty',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' }
    ],
    value: filters.warranty_status,
    onChange: (value: string) => updateFilter('warranty_status', value)
  }
];
