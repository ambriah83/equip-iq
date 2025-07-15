import React from 'react';
import { MOCK_LOCATIONS } from '../../lib/data';
import StatusBadge from '../shared/StatusBadge';

const LocationsPage: React.FC = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Locations
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_LOCATIONS.map(loc => (
          <div key={loc.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {loc.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {loc.address}
                </p>
              </div>
              <StatusBadge status={loc.status} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-4">
              {loc.equipmentCount} Assets
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsPage;