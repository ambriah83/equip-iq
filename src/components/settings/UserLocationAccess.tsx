
import React from 'react';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useLocations } from '@/hooks/useLocations';

interface UserLocationAccessProps {
  selectedLocations: string[];
  onLocationToggle: (locationId: string, checked: boolean) => void;
}

const UserLocationAccess: React.FC<UserLocationAccessProps> = ({
  selectedLocations,
  onLocationToggle
}) => {
  const { locations } = useLocations();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Location Access</h3>
      <p className="text-sm text-gray-600">
        Select which locations this user can access
      </p>
      
      <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
        {locations.map((location) => (
          <div key={location.id} className="flex items-center space-x-2">
            <Checkbox
              id={`location-${location.id}`}
              checked={selectedLocations.includes(location.id)}
              onCheckedChange={(checked) => 
                onLocationToggle(location.id, checked as boolean)
              }
            />
            <Label
              htmlFor={`location-${location.id}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {location.name} ({location.abbreviation})
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserLocationAccess;
