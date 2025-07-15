// Limble CMMS API Integration Service
// Simple MVP implementation - just 3 essential functions

// Use CORS proxy in development to avoid CORS issues
const LIMBLE_API_BASE_URL = import.meta.env.DEV 
  ? 'https://cors-anywhere.herokuapp.com/https://api.limblecmms.com/v2' 
  : 'https://api.limblecmms.com/v2';
const LIMBLE_CLIENT_ID = import.meta.env.LIMBLE_CLIENT_ID || '0IUG6E5S77MPV37ZGPM9LW7MAN41YZTH';

// Get credentials from environment
const getCredentials = () => {
  const clientSecret = import.meta.env.VITE_LIMBLE_CLIENT_SECRET;
  console.log('Limble credentials check:', {
    hasClientSecret: !!clientSecret,
    clientId: LIMBLE_CLIENT_ID,
    secretPreview: clientSecret ? `${clientSecret.substring(0, 5)}...` : 'NOT FOUND'
  });
  
  if (!clientSecret) {
    throw new Error('VITE_LIMBLE_CLIENT_SECRET not found in environment variables');
  }
  return {
    clientId: LIMBLE_CLIENT_ID,
    clientSecret
  };
};

// Common headers for all Limble API requests (using Basic Auth)
const getHeaders = () => {
  const { clientId, clientSecret } = getCredentials();
  // Use btoa for browser environment
  const authString = btoa(`${clientId}:${clientSecret}`);
  
  return {
    'Authorization': `Basic ${authString}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
};

// Helper to build URL based on environment
const buildUrl = (path: string) => {
  // Simply append the path
  return `${LIMBLE_API_BASE_URL}${path}`;
};

// Fetch all equipment from Limble
export const getEquipmentList = async () => {
  try {
    const response = await fetch(buildUrl('/assets'), {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch equipment: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Limble data to match our Equipment interface
    return data.results.map((asset: any) => ({
      id: asset.id,
      name: asset.name,
      serial_number: asset.serial_number || '',
      model: asset.model || '',
      location_id: asset.location_id,
      status: asset.status === 'active' ? 'operational' : 'maintenance',
      last_maintenance_date: asset.last_work_order_date || null,
      limble_asset_id: asset.id // Store Limble ID for reference
    }));
  } catch (error) {
    console.error('Error fetching equipment from Limble:', error);
    throw error;
  }
};

// Get maintenance history for specific equipment
export const getMaintenanceHistory = async (assetId: string) => {
  try {
    const response = await fetch(
      `${LIMBLE_API_BASE_URL}/work-orders?asset=${assetId}&limit=50`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch maintenance history: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform work orders to maintenance records
    return data.results.map((workOrder: any) => ({
      id: workOrder.id,
      equipment_id: assetId,
      date: workOrder.created_at,
      type: workOrder.work_order_type || 'maintenance',
      description: workOrder.title,
      notes: workOrder.description || '',
      performed_by: workOrder.assigned_to_name || 'Unknown',
      status: workOrder.status,
      cost: workOrder.total_cost || 0
    }));
  } catch (error) {
    console.error('Error fetching maintenance history from Limble:', error);
    throw error;
  }
};

// Create a work order in Limble
export const createWorkOrder = async (data: {
  title: string;
  description: string;
  assetId: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  suggestedByAI?: boolean;
}) => {
  try {
    const workOrderData = {
      title: data.title,
      description: data.description,
      asset_id: data.assetId,
      priority: data.priority,
      work_order_type: 'corrective', // Default to corrective maintenance
      status: 'open',
      custom_fields: data.suggestedByAI ? {
        suggested_by: 'EquipIQ AI Assistant'
      } : {}
    };

    const response = await fetch(`${LIMBLE_API_BASE_URL}/work-orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(workOrderData)
    });

    if (!response.ok) {
      throw new Error(`Failed to create work order: ${response.statusText}`);
    }

    const result = await response.json();
    
    return {
      success: true,
      workOrderId: result.id,
      workOrderNumber: result.work_order_number,
      message: `Work order ${result.work_order_number} created successfully`
    };
  } catch (error) {
    console.error('Error creating work order in Limble:', error);
    throw error;
  }
};

// Fetch all locations from Limble
export const getLocations = async () => {
  try {
    const response = await fetch(`${LIMBLE_API_BASE_URL}/locations`, {
      method: 'GET',
      headers: getHeaders()
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch locations: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Transform Limble locations to match our Location interface
    return data.results.map((location: any) => ({
      id: location.id,
      name: location.name,
      address: location.address || '',
      city: location.city || '',
      state: location.state || '',
      zip: location.zip || '',
      country: location.country || 'US',
      limble_location_id: location.id,
      equipment_count: location.asset_count || 0
    }));
  } catch (error) {
    console.error('Error fetching locations from Limble:', error);
    throw error;
  }
};

// Sync locations from Limble to our database
export const syncLocationsFromLimble = async () => {
  try {
    // For development, use mock data
    if (import.meta.env.DEV) {
      console.log('Development mode: Using mock Limble locations');
      const mockLocations = [
        {
          id: 'limble-loc-1',
          name: 'Sarasota Main Street',
          address: '123 Main St',
          city: 'Sarasota',
          state: 'FL',
          zip: '34236',
          country: 'US',
          limble_location_id: 'limble-loc-1',
          equipment_count: 5
        },
        {
          id: 'limble-loc-2',
          name: 'Bradenton West',
          address: '456 Ocean Blvd',
          city: 'Bradenton',
          state: 'FL',
          zip: '34207',
          country: 'US',
          limble_location_id: 'limble-loc-2',
          equipment_count: 3
        },
        {
          id: 'limble-loc-3',
          name: 'Venice Beach',
          address: '789 Beach Rd',
          city: 'Venice',
          state: 'FL',
          zip: '34285',
          country: 'US',
          limble_location_id: 'limble-loc-3',
          equipment_count: 4
        }
      ];
      
      return {
        success: true,
        locations: mockLocations,
        count: mockLocations.length
      };
    }
    
    const limbleLocations = await getLocations();
    return {
      success: true,
      locations: limbleLocations,
      count: limbleLocations.length
    };
  } catch (error) {
    console.error('Error syncing locations from Limble:', error);
    return {
      success: false,
      error: error.message,
      locations: [],
      count: 0
    };
  }
};

// Get assets for a specific location
export const getLocationAssets = async (locationId: string) => {
  try {
    const response = await fetch(
      `${LIMBLE_API_BASE_URL}/assets?location=${locationId}`,
      {
        method: 'GET',
        headers: getHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch location assets: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching location assets from Limble:', error);
    throw error;
  }
};

// Export a test function to verify connection
export const testLimbleConnection = async () => {
  try {
    // For development, use mock data to test the UI
    if (import.meta.env.DEV) {
      console.log('Development mode: Using mock Limble connection');
      // Simulate successful connection for testing
      return true;
    }
    
    console.log('Testing Limble connection...');
    const headers = getHeaders();
    console.log('Request headers:', {
      ...headers,
      'Authorization': headers.Authorization ? `${headers.Authorization.substring(0, 20)}...` : 'NOT SET'
    });
    
    const response = await fetch(buildUrl('/assets?limit=1'), {
      method: 'GET',
      headers: headers
    });
    
    console.log('Limble API response:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Limble API error response:', errorText);
    }
    
    return response.ok;
  } catch (error) {
    console.error('Limble connection test failed:', error);
    return false;
  }
};