
# Database Schema Documentation

## Schema Overview
Operations Hub uses a PostgreSQL database through Supabase with 8 main tables supporting multi-location equipment management with role-based access control.

## Core Tables

### **locations**
Primary table for franchise location management.

```sql
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Glo Tanning - Tampa Bay"
  abbreviation TEXT NOT NULL UNIQUE,     -- "FL_Tampa" 
  address TEXT,                          -- Full street address
  manager_name TEXT,                     -- Location manager
  phone TEXT,                           -- Contact phone
  email TEXT,                           -- Contact email  
  status TEXT NOT NULL DEFAULT 'active', -- active|maintenance|closed
  notes TEXT,                           -- Additional information
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Key Features:**
- Unique abbreviation codes for easy reference
- Status tracking for operational state
- Manager assignment and contact information
- Audit trail with timestamps

### **rooms**
Room organization within locations.

```sql
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID NOT NULL REFERENCES locations(id),
  name TEXT NOT NULL,                    -- "Tanning Room 1"
  room_type TEXT,                       -- "tanning"|"office"|"storage"
  capacity INTEGER,                     -- Max occupancy
  floor_number INTEGER,                 -- Multi-floor support
  description TEXT,                     -- Room details
  status TEXT NOT NULL DEFAULT 'active', -- active|maintenance|inactive
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Relationships:**
- Many rooms belong to one location
- One room can contain multiple equipment pieces

### **equipment_types**
Equipment categorization and specifications.

```sql
CREATE TABLE equipment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Tanning Bed", "UV Booth"
  description TEXT,                      -- Detailed specifications
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Usage:**
- Standardized equipment categorization
- Consistent naming across locations
- Vendor-equipment type associations

### **equipment**
Core equipment tracking with comprehensive metadata.

```sql
CREATE TABLE equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                    -- "Tanning Bed #3"
  serial_number TEXT,                   -- Manufacturer serial
  equipment_type_id UUID NOT NULL REFERENCES equipment_types(id),
  location_id UUID NOT NULL REFERENCES locations(id),
  room_id UUID REFERENCES rooms(id),    -- Optional room assignment
  status TEXT NOT NULL DEFAULT 'active', -- active|maintenance|inactive
  warranty_status TEXT NOT NULL DEFAULT 'inactive', -- active|inactive
  warranty_expiry_date DATE,            -- Warranty end date
  last_service_date DATE,              -- Most recent service
  tmax_connection TEXT,                -- Tanning equipment specific
  equipment_photo_url TEXT,            -- Equipment photo
  room_photo_url TEXT,                 -- Room context photo  
  room_layout_url TEXT,                -- Room layout diagram
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Key Features:**
- Hierarchical location assignment (Location → Room → Equipment)
- Warranty tracking with expiry alerts
- Photo documentation support
- Specialized fields for tanning equipment (TMAX)
- Service history integration

### **equipment_logs**
Comprehensive service and maintenance history.

```sql
CREATE TABLE equipment_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  title TEXT NOT NULL,                  -- "Bulb Replacement"
  description TEXT,                     -- Detailed log entry
  log_type TEXT NOT NULL,              -- "maintenance"|"repair"|"inspection"
  performed_by UUID,                   -- Technician/user reference
  cost NUMERIC(10,2),                  -- Service cost
  parts_used TEXT[],                   -- Array of parts used
  next_service_date DATE,              -- Scheduled next service
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Capabilities:**
- Complete service history tracking
- Cost tracking and reporting
- Parts inventory integration
- Scheduled maintenance planning
- Technician performance tracking

### **vendors**
Vendor and service provider management.

```sql
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,           -- "TechnoTan Services"
  equipment_type TEXT NOT NULL,         -- Equipment specialization
  equipment_name TEXT,                  -- Specific equipment expertise
  contact_name TEXT,                    -- Primary contact person
  phone TEXT,                          -- Contact phone
  website_email TEXT,                  -- Contact email
  vendor_department TEXT,              -- Specialization area
  notes TEXT,                          -- Additional information
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Features:**
- Equipment specialization tracking
- Multiple contact methods
- Department/skill categorization
- Service capability documentation

### **knowledge_base**
Documentation and manual storage.

```sql
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES equipment(id),
  title TEXT NOT NULL,                  -- "User Manual - Model X200"
  document_type TEXT NOT NULL,          -- "manual"|"procedure"|"training"
  content TEXT,                        -- Document content/description
  file_url TEXT,                       -- Stored document URL
  tags TEXT[],                         -- Searchable tags
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Purpose:**
- Equipment-specific documentation
- Training material organization
- Searchable knowledge repository
- File attachment support

## User Management Schema

### **user_permissions**
Individual user permission overrides.

```sql
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,               -- References auth.users
  role user_role NOT NULL,             -- User's assigned role
  permission escalation_permission NOT NULL,
  is_allowed BOOLEAN NOT NULL DEFAULT false,
  custom_permissions_applied BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, permission)
);
```

### **role_permissions**
Default permissions per role.

```sql
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role user_role NOT NULL,
  permission escalation_permission NOT NULL, 
  is_allowed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(role, permission)
);
```

### **user_location_access**
Location-specific user access control.

```sql
CREATE TABLE user_location_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,               -- References auth.users
  location_id UUID NOT NULL REFERENCES locations(id),
  access_level TEXT NOT NULL DEFAULT 'read', -- read|write|admin
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID DEFAULT auth.uid()   -- Who granted access
);
```

## Custom Types (Enums)

### **user_role**
```sql
CREATE TYPE user_role AS ENUM (
  'owner',      -- Full system access
  'admin',      -- Administrative privileges  
  'manager',    -- Location management
  'staff',      -- Basic operations
  'vendor'      -- Limited service access
);
```

### **escalation_permission**
```sql
CREATE TYPE escalation_permission AS ENUM (
  'can_use_ladder',
  'can_handle_electrical', 
  'can_disassemble_parts',
  'can_work_at_height',
  'can_handle_chemicals',
  'can_operate_heavy_equipment',
  'can_access_restricted_areas',
  'can_perform_emergency_shutdowns'
);
```

## Database Functions

### **get_user_permissions**
Retrieves effective permissions for a user (role defaults + custom overrides).

```sql
CREATE OR REPLACE FUNCTION get_user_permissions(
  target_user_id UUID, 
  user_role user_role
) 
RETURNS TABLE(
  permission escalation_permission, 
  is_allowed BOOLEAN, 
  is_custom BOOLEAN
);
```

### **initialize_user_permissions**
Sets up default permissions for a new user based on their role.

```sql
CREATE OR REPLACE FUNCTION initialize_user_permissions(
  target_user_id UUID,
  user_role user_role
) 
RETURNS VOID;
```

## Indexes and Performance

### **Primary Indexes**
- All tables have UUID primary keys with automatic indexing
- Foreign key columns automatically indexed
- Unique constraints on critical fields (location abbreviation)

### **Query Optimization**
```sql
-- Equipment queries by location
CREATE INDEX idx_equipment_location ON equipment(location_id);

-- Equipment logs by date range  
CREATE INDEX idx_equipment_logs_date ON equipment_logs(created_at);

-- User permissions lookup
CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
```

## Row Level Security (RLS)

### **Security Model**
- **Public Access**: Equipment types, general location info
- **Authenticated Access**: User-specific permissions applied
- **Role-Based Filtering**: Data filtered by user role and location access
- **Admin Override**: Owners and admins see all data

### **Example RLS Policy**
```sql
-- Users can only see equipment at locations they have access to
CREATE POLICY "location_access_equipment" ON equipment
  FOR SELECT USING (
    location_id IN (
      SELECT location_id FROM user_location_access 
      WHERE user_id = auth.uid()
    )
  );
```

## Data Relationships Summary

```
locations (1) ──── (many) rooms (1) ──── (many) equipment
    │                                         │
    └── (many) user_location_access          │
                                             │
equipment (1) ──── (many) equipment_logs    │
    │                                        │
    └── (1) equipment_types                  │
                                             │
equipment (1) ──── (many) knowledge_base    │
                                             │
vendors ──── (specialization) ──── equipment_types
```

This schema supports:
- **Multi-location operations** with hierarchical organization
- **Comprehensive equipment tracking** with service history
- **Role-based access control** with location-level permissions  
- **Vendor management** with equipment specialization
- **Knowledge management** with searchable documentation
- **Audit trails** with timestamp tracking throughout
