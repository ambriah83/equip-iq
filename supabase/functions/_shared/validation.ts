// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Common validation functions
export const validateEmail = (email: string): boolean => {
  return EMAIL_REGEX.test(email);
};

export const validateRequired = (value: any, fieldName: string): void => {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${fieldName} is required`);
  }
};

export const validateString = (value: any, fieldName: string, minLength = 1, maxLength = 1000): void => {
  if (typeof value !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  
  if (value.length < minLength) {
    throw new Error(`${fieldName} must be at least ${minLength} characters long`);
  }
  
  if (value.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters long`);
  }
};

export const validateNumber = (value: any, fieldName: string, min?: number, max?: number): void => {
  const num = Number(value);
  
  if (isNaN(num)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
  
  if (min !== undefined && num < min) {
    throw new Error(`${fieldName} must be at least ${min}`);
  }
  
  if (max !== undefined && num > max) {
    throw new Error(`${fieldName} must be at most ${max}`);
  }
};

export const validateUUID = (value: any, fieldName: string): void => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (typeof value !== "string" || !uuidRegex.test(value)) {
    throw new Error(`${fieldName} must be a valid UUID`);
  }
};

export const validateArray = (value: any, fieldName: string, minLength = 0, maxLength = 100): void => {
  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }
  
  if (value.length < minLength) {
    throw new Error(`${fieldName} must contain at least ${minLength} items`);
  }
  
  if (value.length > maxLength) {
    throw new Error(`${fieldName} must contain at most ${maxLength} items`);
  }
};

export const validateEnum = <T>(value: any, fieldName: string, allowedValues: T[]): void => {
  if (!allowedValues.includes(value)) {
    throw new Error(`${fieldName} must be one of: ${allowedValues.join(", ")}`);
  }
};

// Validate base64 image data
export const validateImageData = (imageData: string, maxSizeMB = 10): void => {
  validateRequired(imageData, "imageData");
  validateString(imageData, "imageData");
  
  // Check if it's a valid base64 data URL
  const base64Regex = /^data:image\/(png|jpg|jpeg|gif|webp);base64,/;
  if (!base64Regex.test(imageData)) {
    throw new Error("Invalid image data format. Expected base64 data URL");
  }
  
  // Estimate size (base64 is ~33% larger than binary)
  const sizeInBytes = (imageData.length - imageData.indexOf(",") - 1) * 0.75;
  const sizeInMB = sizeInBytes / (1024 * 1024);
  
  if (sizeInMB > maxSizeMB) {
    throw new Error(`Image size exceeds ${maxSizeMB}MB limit`);
  }
};

// Validate request body size
export const validateRequestSize = async (request: Request, maxSizeMB = 10): Promise<void> => {
  const contentLength = request.headers.get("content-length");
  
  if (contentLength) {
    const sizeInBytes = parseInt(contentLength);
    const sizeInMB = sizeInBytes / (1024 * 1024);
    
    if (sizeInMB > maxSizeMB) {
      throw new Error(`Request size exceeds ${maxSizeMB}MB limit`);
    }
  }
};