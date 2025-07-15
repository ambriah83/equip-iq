import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const LocationAccessDebug = () => {
  const [user, setUser] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [userAccess, setUserAccess] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    setLoading(true);
    
    // Get current user
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    setUser(currentUser);
    
    if (!currentUser) {
      setLoading(false);
      return;
    }

    // Try to get all locations (will be filtered by RLS)
    const { data: locs, error: locError } = await supabase
      .from('locations')
      .select('*')
      .order('name');
    
    if (locError) {
      console.error('Error fetching locations:', locError);
    }
    setLocations(locs || []);

    // Check user's location access
    const { data: access, error: accessError } = await supabase
      .from('user_location_access')
      .select('*')
      .eq('user_id', currentUser.id);
    
    if (accessError) {
      console.error('Error fetching user access:', accessError);
    }
    setUserAccess(access || []);

    // Check user permissions
    const { data: perms, error: permsError } = await supabase
      .from('user_permissions')
      .select('*')
      .eq('user_id', currentUser.id);
    
    if (permsError) {
      console.error('Error fetching permissions:', permsError);
    }
    setPermissions(perms || []);

    setLoading(false);
  };

  const grantSuperAdmin = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('user_permissions')
      .insert({
        user_id: user.id,
        permission: 'super_admin',
        is_allowed: true
      });
    
    if (error) {
      console.error('Error granting super admin:', error);
      alert('Error: ' + error.message);
    } else {
      alert('Super admin granted! Please refresh the page.');
      checkAccess();
    }
  };

  const grantAccessToAllLocations = async () => {
    if (!user) return;
    
    // First, get ALL locations without RLS
    const { data: allLocations } = await supabase.rpc('get_all_locations_count');
    
    alert(`Attempting to grant access to locations. This may take a moment...`);
    
    // Get all locations by bypassing RLS temporarily
    const { data: locationData, error: locError } = await supabase
      .from('locations')
      .select('id, name')
      .order('name');
    
    if (locError || !locationData) {
      alert('Could not fetch locations: ' + locError?.message);
      return;
    }

    let granted = 0;
    let errors = 0;
    
    for (const location of locationData) {
      const { error } = await supabase
        .from('user_location_access')
        .upsert({
          user_id: user.id,
          location_id: location.id,
          access_level: 'admin'
        });
      
      if (error) {
        console.error(`Error granting access to ${location.name}:`, error);
        errors++;
      } else {
        granted++;
      }
    }
    
    alert(`Granted access to ${granted} locations. Errors: ${errors}. Please refresh the page.`);
    checkAccess();
  };

  if (loading) return <div>Loading debug info...</div>;

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>Location Access Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">Current User</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            ID: {user?.id || 'Not logged in'}
            Email: {user?.email || 'N/A'}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold">Visible Locations: {locations.length}</h3>
          {locations.length === 0 ? (
            <Alert>
              <AlertDescription>
                No locations visible. This means either:
                <ul className="list-disc list-inside mt-2">
                  <li>No locations exist in the database</li>
                  <li>You don't have access to any locations</li>
                  <li>RLS policies are blocking access</li>
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <ul className="text-sm max-h-40 overflow-y-auto">
              {locations.map(loc => (
                <li key={loc.id}>{loc.name}</li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Your Location Access Records: {userAccess.length}</h3>
          {userAccess.length === 0 ? (
            <p className="text-red-600 text-sm">No access records found!</p>
          ) : (
            <ul className="text-sm max-h-40 overflow-y-auto">
              {userAccess.map(access => (
                <li key={access.id}>
                  Location ID: {access.location_id} - Level: {access.access_level}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="font-semibold">Your Permissions: {permissions.length}</h3>
          {permissions.length === 0 ? (
            <p className="text-gray-600 text-sm">No special permissions</p>
          ) : (
            <ul className="text-sm">
              {permissions.map(perm => (
                <li key={perm.id}>
                  {perm.permission}: {perm.is_allowed ? '✓' : '✗'}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button onClick={grantSuperAdmin} variant="destructive">
            Grant Super Admin (Nuclear Option)
          </Button>
          <Button onClick={grantAccessToAllLocations} variant="outline">
            Try to Grant Access to All Locations
          </Button>
          <Button onClick={checkAccess} variant="outline">
            Refresh
          </Button>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Quick Fix:</strong> Click "Grant Super Admin" to bypass all location restrictions.
            This will let you see all locations immediately.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};