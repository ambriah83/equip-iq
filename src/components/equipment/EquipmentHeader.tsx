
import React from 'react';
import { Wrench } from 'lucide-react';
import ViewToggle from '../ViewToggle';
import { AddEquipmentDialog } from './';

interface EquipmentHeaderProps {
  view: 'card' | 'list';
  onViewChange: (view: 'card' | 'list') => void;
}

const EquipmentHeader: React.FC<EquipmentHeaderProps> = ({ view, onViewChange }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg text-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench size={24} />
          <div>
            <h2 className="text-xl font-bold">Equipment Management</h2>
            <p className="text-blue-100">Track and maintain all equipment across locations</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={onViewChange} />
          <AddEquipmentDialog />
        </div>
      </div>
    </div>
  );
};

export default EquipmentHeader;
