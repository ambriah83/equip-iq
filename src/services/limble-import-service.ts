// Limble Data Import Service
// Handles importing data from Excel files with proper transformations

import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';

// Helper to clean HTML tags from strings
const cleanHtml = (str: string): string => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
};

// Helper to parse semicolon-separated values
const parseMultiValue = (str: string): string[] => {
  if (!str) return [];
  return str.split(';').map(s => s.trim()).filter(s => s);
};

// Import Locations from Assets file
export const importLocations = async (file: File) => {
  try {
    // Validate file before processing
    if (!file) {
      return {
        success: false,
        error: 'No file provided',
        imported: 0,
        total: 0
      };
    }
    
    // Check file size (limit to 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size exceeds 10MB limit',
        imported: 0,
        total: 0
      };
    }
    
    // Check file type
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls)$/)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)',
        imported: 0,
        total: 0
      };
    }
    
    // Get current user with proper error handling
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Authentication error during import:', authError);
      return {
        success: false,
        error: 'Authentication required. Please log in and try again.',
        imported: 0,
        total: 0
      };
    }
    
    // Store user ID to ensure we maintain the session
    const userId = user.id;
    
    const data = await readExcelFile(file);
    
    // Validate data structure
    if (!Array.isArray(data) || data.length === 0) {
      return {
        success: false,
        error: 'No data found in the Excel file',
        imported: 0,
        total: 0
      };
    }
    
    const locations = new Map<string, any>();
    
    // Extract unique locations with validation
    data.forEach((row, index) => {
      try {
        if (row['Location Name'] && typeof row['Location Name'] === 'string') {
          const locationName = row['Location Name'].trim();
          if (locationName && !locations.has(locationName)) {
            locations.set(locationName, {
              name: locationName,
              // Try to infer state from location name or default to empty
              state: extractState(locationName),
              status: 'active',
              metadata: {
                imported_from_limble: true,
                import_date: new Date().toISOString(),
                row_number: index + 2 // Excel rows start at 1, plus header
              }
            });
          }
        }
      } catch (err) {
        console.error(`Error processing row ${index + 2}:`, err);
      }
    });
    
    if (locations.size === 0) {
      return {
        success: false,
        error: 'No valid locations found in the file. Please check the "Location Name" column.',
        imported: 0,
        total: 0
      };
    }
    
    // Insert locations into database with transaction-like behavior
    const results = [];
    const errors = [];
    let processedCount = 0;
    
    for (const [name, location] of locations) {
      processedCount++;
      try {
        // Check for existing location
        const { data: existingLocation, error: checkError } = await supabase
          .from('locations')
          .select('id')
          .eq('name', name)
          .maybeSingle(); // Use maybeSingle instead of single to avoid errors when not found
        
        if (checkError) {
          console.error(`Error checking location "${name}":`, checkError);
          errors.push(`Failed to check if "${name}" exists: ${checkError.message}`);
          continue;
        }
        
        if (!existingLocation) {
          // Generate a unique abbreviation
          let abbreviation = name.substring(0, 3).toUpperCase();
          if (abbreviation.length < 3) {
            abbreviation = abbreviation.padEnd(3, 'X');
          }
          
          // Insert new location
          const { data: newLocation, error: insertError } = await supabase
            .from('locations')
            .insert({
              ...location,
              abbreviation: abbreviation
            })
            .select()
            .single();
          
          if (insertError) {
            console.error(`Error inserting location "${name}":`, insertError);
            errors.push(`Failed to create "${name}": ${insertError.message}`);
            continue;
          }
          
          if (newLocation) {
            results.push(newLocation);
            
            // Grant the current user access to this location
            const { error: accessError } = await supabase
              .from('user_location_access')
              .insert({
                user_id: userId,
                location_id: newLocation.id,
                access_level: 'admin'
              })
              .select();
              
            if (accessError) {
              console.warn(`Warning: Could not grant access to location "${name}":`, accessError);
              // Don't fail the import, just log the warning
            }
          }
        } else {
          console.log(`Location "${name}" already exists, skipping`);
        }
      } catch (err) {
        console.error(`Unexpected error processing location "${name}":`, err);
        errors.push(`Unexpected error for "${name}": ${err.message}`);
      }
      
      // Add a small delay every 10 items to prevent overwhelming the database
      if (processedCount % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Determine overall success
    const success = results.length > 0 || (results.length === 0 && errors.length === 0);
    
    return {
      success: success,
      imported: results.length,
      total: locations.size,
      locations: results,
      errors: errors.length > 0 ? errors : undefined,
      warning: errors.length > 0 ? `Imported ${results.length} of ${locations.size} locations. ${errors.length} failed.` : undefined
    };
  } catch (error) {
    console.error('Critical error importing locations:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      imported: 0,
      total: 0
    };
  }
};

// Import Equipment/Assets
export const importEquipment = async (file: File) => {
  try {
    const data = await readExcelFile(file);
    const equipment = [];
    const rooms = new Map<string, any>();
    
    // First, get all locations
    const { data: locations } = await supabase
      .from('locations')
      .select('id, name');
    
    const locationMap = new Map(
      locations?.map(loc => [loc.name, loc.id]) || []
    );
    
    // Process each asset
    for (const row of data) {
      const locationName = row['Location Name']?.trim();
      const locationId = locationMap.get(locationName);
      
      if (!locationId) continue;
      
      // Check if this is a room
      const parentAsset = row['Parent Asset']?.trim();
      const assetName = row['Asset Name']?.trim();
      
      if (parentAsset && parentAsset.toLowerCase().includes('room')) {
        // This is equipment in a room
        const roomKey = `${locationId}-${parentAsset}`;
        if (!rooms.has(roomKey)) {
          rooms.set(roomKey, {
            location_id: locationId,
            name: parentAsset,
            room_number: extractRoomNumber(parentAsset)
          });
        }
      }
      
      // Create equipment record
      if (assetName && !assetName.toLowerCase().includes('room')) {
        equipment.push({
          name: assetName,
          location_id: locationId,
          manufacturer: row['Make']?.trim() || null,
          model: row['Model']?.trim() || null,
          serial_number: row['Serial Number']?.trim() || null,
          equipment_type: mapEquipmentType(cleanHtml(row['Category'] || '')),
          status: row['Machine Status']?.toLowerCase() === 'down' ? 'needs_repair' : 'operational',
          warranty_expiration: row['Warranty Expiration'] || null,
          notes: row['Notes']?.trim() || null,
          metadata: {
            limble_asset_id: row['Limble Asset ID'],
            parent_asset: parentAsset,
            parent_asset_id: row['Parent Asset ID'],
            barcode: row['Barcode'],
            imported_from_limble: true,
            import_date: new Date().toISOString()
          }
        });
      }
    }
    
    // Insert rooms first
    const roomResults = [];
    for (const room of rooms.values()) {
      const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert(room)
        .select()
        .single();
      
      if (!error && newRoom) {
        roomResults.push(newRoom);
      }
    }
    
    // Insert equipment
    const equipmentResults = [];
    for (const eq of equipment) {
      const { data: newEquipment, error } = await supabase
        .from('equipment')
        .insert(eq)
        .select()
        .single();
      
      if (!error && newEquipment) {
        equipmentResults.push(newEquipment);
      }
    }
    
    return {
      success: true,
      imported: equipmentResults.length,
      rooms: roomResults.length,
      total: equipment.length
    };
  } catch (error) {
    console.error('Error importing equipment:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Import Vendors
export const importVendors = async (file: File) => {
  try {
    const data = await readExcelFile(file);
    const vendors = new Map<string, any>();
    
    for (const row of data) {
      const vendorName = row['Company Name']?.trim();
      if (!vendorName) continue;
      
      if (!vendors.has(vendorName)) {
        vendors.set(vendorName, {
          company_name: vendorName,
          contact_name: row['CONTACT NAME']?.trim() || null,
          phone: row['PHONE #']?.trim() || null,
          website_email: row['Website/Email']?.trim() || null,
          equipment_name: row['EQUIPMENT NAME']?.trim() || null,
          equipment_type: row['Equipment TYPE']?.trim() || 'other',
          vendor_department: row['VENDOR DEPARTMENT']?.trim() || null,
          notes: row['Notes']?.trim() || null,
          is_primary: true
        });
      }
    }
    
    // Insert vendors
    const results = [];
    for (const vendor of vendors.values()) {
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('company_name', vendor.company_name)
        .single();
      
      if (!existingVendor) {
        const { data: newVendor, error } = await supabase
          .from('vendors')
          .insert(vendor)
          .select()
          .single();
        
        if (!error && newVendor) {
          results.push(newVendor);
        } else if (error) {
          console.error('Error inserting vendor:', vendor.company_name, error);
        }
      }
    }
    
    return {
      success: true,
      imported: results.length,
      total: vendors.size
    };
  } catch (error) {
    console.error('Error importing vendors:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Import Users from Work Orders
export const importUsers = async (file: File) => {
  try {
    const data = await readExcelFile(file);
    const users = new Map<string, any>();
    
    for (const row of data) {
      const assignedTo = row['Assigned To']?.trim();
      if (!assignedTo || assignedTo === 'Unassigned') continue;
      
      if (!users.has(assignedTo)) {
        users.set(assignedTo, {
          name: assignedTo,
          email: `${assignedTo.toLowerCase().replace(/\s+/g, '.')}@equipiq.temp`,
          role: 'staff', // Default role
          status: 'active',
          metadata: {
            imported_from_limble: true,
            needs_email_update: true
          }
        });
      }
    }
    
    // Note: User creation might need special handling due to auth
    return {
      success: true,
      users: Array.from(users.values()),
      total: users.size,
      note: 'Users extracted - manual creation may be required'
    };
  } catch (error) {
    console.error('Error extracting users:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Helper function to read Excel file with proper error handling
async function readExcelFile(file: File): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    // Set a timeout for file reading
    const timeout = setTimeout(() => {
      reader.abort();
      reject(new Error('File reading timed out after 30 seconds'));
    }, 30000);
    
    reader.onload = (e) => {
      clearTimeout(timeout);
      try {
        if (!e.target?.result) {
          reject(new Error('Failed to read file contents'));
          return;
        }
        
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        
        // Check if XLSX is loaded
        if (!XLSX || !XLSX.read) {
          reject(new Error('Excel library not loaded. Please refresh the page and try again.'));
          return;
        }
        
        const workbook = XLSX.read(data, { 
          type: 'array',
          cellDates: true,
          cellNF: false,
          cellText: false
        });
        
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          reject(new Error('No sheets found in the Excel file'));
          return;
        }
        
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!firstSheet) {
          reject(new Error('Unable to read the first sheet'));
          return;
        }
        
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, {
          raw: false,
          defval: null,
          blankrows: false
        });
        
        resolve(jsonData);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error(`Failed to parse Excel file: ${error.message || 'Unknown error'}`));
      }
    };
    
    reader.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to read file. Please check the file and try again.'));
    };
    
    reader.onabort = () => {
      clearTimeout(timeout);
      reject(new Error('File reading was cancelled'));
    };
    
    try {
      reader.readAsArrayBuffer(file);
    } catch (error) {
      clearTimeout(timeout);
      reject(new Error(`Failed to start reading file: ${error.message}`));
    }
  });
}

// Helper to extract state from location name
function extractState(locationName: string): string {
  const statePatterns = {
    'OK': ['Oklahoma', 'OK', 'Tulsa', 'Norman'],
    'TX': ['Texas', 'TX', 'Dallas', 'Houston'],
    'FL': ['Florida', 'FL', 'Sarasota', 'Bradenton'],
    'AR': ['Arkansas', 'AR', 'Little Rock']
  };
  
  for (const [state, patterns] of Object.entries(statePatterns)) {
    if (patterns.some(p => locationName.includes(p))) {
      return state;
    }
  }
  
  return '';
}

// Helper to extract room number
function extractRoomNumber(roomName: string): string {
  const match = roomName.match(/room\s*(\d+)/i);
  return match ? match[1] : '';
}

// Helper to map Limble categories to EquipIQ equipment types
function mapEquipmentType(category: string): string {
  const categoryLower = category.toLowerCase();
  
  if (categoryLower.includes('sun') || categoryLower.includes('tan')) {
    return 'sun_bed';
  } else if (categoryLower.includes('spray')) {
    return 'spray_tan';
  } else if (categoryLower.includes('spa')) {
    return 'spa';
  } else if (categoryLower.includes('red') || categoryLower.includes('light')) {
    return 'red_light';
  } else if (categoryLower.includes('hvac') || categoryLower.includes('air')) {
    return 'hvac';
  } else if (categoryLower.includes('wash')) {
    return 'other';
  } else if (categoryLower.includes('dry')) {
    return 'other';
  }
  
  return 'other';
}