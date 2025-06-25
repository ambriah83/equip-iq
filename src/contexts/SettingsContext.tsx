
import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface DropdownField {
  id: string;
  label: string;
  options: string[];
}

interface SettingsData {
  equipmentTypes: string[];
  vendorTypes: string[];
  locationTypes: string[];
  customFields: DropdownField[];
}

interface SettingsContextType {
  settings: SettingsData;
  updateEquipmentTypes: (types: string[]) => void;
  updateVendorTypes: (types: string[]) => void;
  updateLocationTypes: (types: string[]) => void;
  addCustomField: (field: DropdownField) => void;
  updateCustomField: (id: string, field: DropdownField) => void;
  deleteCustomField: (id: string) => void;
}

const defaultSettings: SettingsData = {
  equipmentTypes: ['Sun', 'Spray', 'Spa', 'Red Light', 'Other', 'HVAC', 'Washer', 'Dryer'],
  vendorTypes: ['electrician', 'plumber', 'handyman'],
  locationTypes: ['Salon', 'Spa', 'Wellness Center'],
  customFields: []
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage<SettingsData>('app-settings', defaultSettings);

  const updateEquipmentTypes = (types: string[]) => {
    setSettings(prev => ({ ...prev, equipmentTypes: types }));
  };

  const updateVendorTypes = (types: string[]) => {
    setSettings(prev => ({ ...prev, vendorTypes: types }));
  };

  const updateLocationTypes = (types: string[]) => {
    setSettings(prev => ({ ...prev, locationTypes: types }));
  };

  const addCustomField = (field: DropdownField) => {
    setSettings(prev => ({
      ...prev,
      customFields: [...prev.customFields, field]
    }));
  };

  const updateCustomField = (id: string, field: DropdownField) => {
    setSettings(prev => ({
      ...prev,
      customFields: prev.customFields.map(f => f.id === id ? field : f)
    }));
  };

  const deleteCustomField = (id: string) => {
    setSettings(prev => ({
      ...prev,
      customFields: prev.customFields.filter(f => f.id !== id)
    }));
  };

  return (
    <SettingsContext.Provider value={{
      settings,
      updateEquipmentTypes,
      updateVendorTypes,
      updateLocationTypes,
      addCustomField,
      updateCustomField,
      deleteCustomField
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
