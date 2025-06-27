
import { MappedLocationData } from './LocationColumnMapper';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class LocationDataValidator {
  /**
   * Validate mapped location data
   */
  static validateLocationData(mappedLocation: MappedLocationData, row: any, rowNum: number): ValidationResult {
    const errors: string[] = [];

    // Validate required fields with detailed error messages
    if (!mappedLocation.locationName || !mappedLocation.locationName.toString().trim()) {
      const availableColumns = Object.keys(row).join(', ');
      errors.push(`Row ${rowNum}: Location name is required but not found. Available columns: ${availableColumns}`);
    }

    if (!mappedLocation.abbreviation || !mappedLocation.abbreviation.toString().trim()) {
      const availableColumns = Object.keys(row).join(', ');
      errors.push(`Row ${rowNum}: "Tan-Link or SunLync" abbreviation is required but not found. Available columns: ${availableColumns}`);
    }

    if (!mappedLocation.address || !mappedLocation.address.toString().trim()) {
      const availableColumns = Object.keys(row).join(', ');
      errors.push(`Row ${rowNum}: Address is required but not found. Available columns: ${availableColumns}`);
    }

    // Validate status if provided
    if (mappedLocation.status) {
      const normalizedStatus = mappedLocation.status.toString().toLowerCase();
      if (!['active', 'maintenance', 'closed'].includes(normalizedStatus)) {
        errors.push(`Row ${rowNum}: Invalid status "${normalizedStatus}". Must be 'active', 'maintenance', or 'closed'`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Normalize location data for database insertion
   */
  static normalizeLocationData(mappedLocation: MappedLocationData) {
    // Normalize ownership type
    let normalizedOwnershipType = 'franchise'; // Default
    if (mappedLocation.ownershipType) {
      const ownershipStr = mappedLocation.ownershipType.toString().toLowerCase();
      if (ownershipStr.includes('corporate')) {
        normalizedOwnershipType = 'corporate';
      } else if (ownershipStr.includes('franchise')) {
        normalizedOwnershipType = 'franchise';
      }
    }

    // Normalize status
    const normalizedStatus = (mappedLocation.status?.toString()?.toLowerCase() || 'active');

    return {
      name: mappedLocation.locationName.toString().trim(),
      abbreviation: mappedLocation.abbreviation.toString().trim(),
      address: mappedLocation.address.toString().trim(),
      manager_name: mappedLocation.managerName?.toString()?.trim() || null,
      phone: mappedLocation.phone?.toString()?.trim() || null,
      email: mappedLocation.email?.toString()?.trim() || null,
      ownership_type: normalizedOwnershipType,
      status: normalizedStatus,
      notes: mappedLocation.notes?.toString()?.trim() || null
    };
  }
}
