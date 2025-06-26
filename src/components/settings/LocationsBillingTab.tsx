
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocations } from '@/hooks/useLocations';
import LocationBillingCard from './LocationBillingCard';
import { Loader2, Building } from 'lucide-react';

const LocationsBillingTab = () => {
  const { locations, loading } = useLocations();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading locations...
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Payment Methods</CardTitle>
        <CardDescription>
          Configure individual payment methods for each location. This allows owners to use different cards per location and helps technicians know which payment method to use.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {locations.length === 0 ? (
          <div className="text-center py-8">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No locations found. Add locations to configure payment methods.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <LocationBillingCard 
                key={location.id} 
                location={location}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationsBillingTab;
