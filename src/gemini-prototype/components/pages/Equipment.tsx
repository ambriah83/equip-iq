import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_EQUIPMENT } from '../../lib/data';
import StatusBadge from '../shared/StatusBadge';

const EquipmentPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Equipment Fleet
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_EQUIPMENT.map(eq => (
          <div 
            key={eq.id} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer group" 
            onClick={() => navigate(`/app/equipment/${eq.id}`)}
          >
            <div className="relative">
              <img 
                src={eq.image} 
                alt={eq.name} 
                className="w-full h-48 object-cover" 
              />
              <div className="absolute top-4 right-4">
                <StatusBadge status={eq.status} />
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {eq.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {eq.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EquipmentPage;