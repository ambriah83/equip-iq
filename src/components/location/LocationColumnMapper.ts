
export interface MappedLocationData {
  locationName: string;
  abbreviation: string;
  address: string;
  managerName?: string;
  phone?: string;
  email?: string;
  ownershipType?: string;
  status?: string;
  notes?: string;
}

export class LocationColumnMapper {
  /**
   * Enhanced column mapping function specifically for Glo Tanning CSV format
   */
  static mapColumnValue(row: any, possibleKeys: string[], fallbackKeys: string[] = []): string {
    // Try exact matches first
    for (const key of possibleKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    
    // Try case-insensitive matches
    const rowKeys = Object.keys(row);
    for (const targetKey of possibleKeys) {
      const matchingKey = rowKeys.find(key => 
        key.toLowerCase() === targetKey.toLowerCase()
      );
      if (matchingKey && row[matchingKey] !== undefined && row[matchingKey] !== null && row[matchingKey] !== '') {
        return row[matchingKey];
      }
    }
    
    // Try fallback keys
    for (const key of fallbackKeys) {
      if (row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return row[key];
      }
    }
    
    return '';
  }

  /**
   * Map a CSV row to location data using enhanced column mapping
   */
  static mapRowToLocation(row: any): MappedLocationData {
    const locationName = this.mapColumnValue(row, [
      'Location Name', 'LocationName', 'location name', 'LOCATION NAME',
      'name', 'Name', 'NAME', 'location', 'Location', 'LOCATION',
      'Store Name', 'store name', 'STORE NAME', 'Store', 'store', 'STORE'
    ]);

    const abbreviation = this.mapColumnValue(row, [
      'Tan-Link or SunLync', 'TanLink or SunLync', 'Tan-Link', 'TanLink',
      'SunLync', 'abbreviation', 'Abbreviation', 'ABBREVIATION',
      'Location Code', 'location code', 'LOCATION CODE',
      'Store Code', 'store code', 'STORE CODE', 'code', 'Code', 'CODE'
    ]);

    const address = this.mapColumnValue(row, [
      'address', 'Address', 'ADDRESS',
      'Street Address', 'street address', 'STREET ADDRESS',
      'Full Address', 'full address', 'FULL ADDRESS',
      'Location Address', 'location address', 'LOCATION ADDRESS'
    ]);

    const managerName = this.mapColumnValue(row, [
      'STORE MANAGER', 'Store Manager', 'store manager',
      'manager_name', 'Manager Name', 'manager name',
      'manager', 'Manager', 'MANAGER'
    ]);

    const phone = this.mapColumnValue(row, [
      'Direct Store Line', 'direct store line', 'DIRECT STORE LINE',
      'phone', 'Phone', 'PHONE',
      'Phone Number', 'phone number', 'PHONE NUMBER',
      'telephone', 'Telephone', 'TELEPHONE'
    ]);

    const email = this.mapColumnValue(row, [
      'email', 'Email', 'EMAIL',
      'Email Address', 'email address', 'EMAIL ADDRESS'
    ]);

    const ownershipType = this.mapColumnValue(row, [
      'Corporate or Franchise', 'corporate or franchise', 'CORPORATE OR FRANCHISE',
      'ownership_type', 'Ownership Type', 'ownership type',
      'type', 'Type', 'TYPE'
    ]);

    const status = this.mapColumnValue(row, [
      'status', 'Status', 'STATUS'
    ], ['active']);

    const notes = this.mapColumnValue(row, [
      'notes', 'Notes', 'NOTES',
      'comments', 'Comments', 'COMMENTS'
    ]);

    return {
      locationName,
      abbreviation,
      address,
      managerName,
      phone,
      email,
      ownershipType,
      status,
      notes
    };
  }
}
