# EquipIQ Project Context

**Last Updated**: 2025-01-27

## 🎯 Project Overview
EquipIQ is an AI-powered multi-location equipment management system designed specifically for tanning salon franchises. Built using Lovable.dev with no coding experience required.

## 👤 Project Owner Context
- **Technical Experience**: No coding experience
- **Development Platform**: Lovable.dev (AI-powered development)
- **Industry**: Tanning salon operations
- **Business Need**: Track equipment, manage maintenance, coordinate vendors across multiple locations

## 🔗 Important Links
- **GitHub Repository**: https://github.com/ambriah83/equip-iq
- **Lovable Project**: https://lovable.dev/projects/1bbe4a9f-b017-44d9-91ea-5a7ba7705cdc
- **Database Schema (26 tables)**: https://docs.google.com/document/d/1DhM5KVtlYUXUcGHewGPeHRF64uHluzSVaKqQJSdNoC4/edit
- **Original Specification**: https://docs.google.com/document/d/1XSYFoYKxMfKWLWD2In6t2SW_0tsdYhJ5k6lZvtrwK-g/edit

## 📊 Current Database Status (2025-01-27)

### ✅ Implemented Tables (20/26)
1. **Core Tables**:
   - `users` - User authentication records
   - `user_profiles` - Extended user information
   - `user_roles` - Role assignments
   - `user_permissions` - Granular permissions
   - `user_location_access` - Location-based access control

2. **Equipment Management**:
   - `equipment` - Equipment records
   - `equipment_types` - Equipment categories
   - `equipment_logs` - Maintenance history
   - `knowledge_base` - Manuals and documentation

3. **Location Management**:
   - `locations` - Salon locations
   - `rooms` - Room organization
   - `property_management` - Lease/landlord info

4. **Vendor Management**:
   - `vendors` - Vendor companies
   - `vendor_contacts` - Multiple contacts per vendor

5. **Operations**:
   - `tickets` - Work orders and issues
   - `ticket_comments` - Work order discussions

6. **Billing**:
   - `owner_billing` - Subscription management
   - `location_billing` - Location payment methods
   - `subscribers` - Subscription tracking

7. **System**:
   - `import_logs` - Data import tracking
   - `role_permissions` - Role-based permissions
   - `user_invitations` - User onboarding

### ❌ Missing Tables (6/26)
1. `legal_entities` - Corporate structure
2. `documents` - File management
3. `digital_assets` - iPads, signage
4. `network_assets` - Routers, cameras
5. `inventory_*` - 4 tables for inventory management
   - `inventory_categories`
   - `inventory_items`
   - `inventory_stock`
   - `inventory_movements`

## 🏗️ Architecture Decisions

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State**: React Query + Context API
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM

### Code Organization
Currently mixed between:
- Component-type organization (legacy)
- Feature-based organization (migration in progress)

**Target Structure**:
```
src/
├── features/          # Business domains
│   ├── equipment/
│   ├── locations/
│   ├── vendors/
│   └── tickets/
├── shared/           # Reusable code
└── app/             # App configuration
```

## 🚀 Implementation Phases

### Phase 1: Core Operations (Current)
- ✅ Basic auth and user management
- ✅ Equipment CRUD
- ✅ Location management
- ✅ Vendor tracking
- ✅ AI chat interface
- ✅ Ticket system (newly added)
- 🚧 Dashboard with real data
- 🚧 Complete UI for tickets

### Phase 2: Enhanced Operations
- Documents management
- Legal entity tracking
- Enhanced reporting
- Real-time notifications

### Phase 3: Asset Management
- Digital asset tracking
- Network equipment
- Complete inventory system

### Phase 4: Advanced Features
- Advanced billing
- Multi-tenant isolation
- API integrations
- Mobile app

## 📝 Lovable.dev Guidelines

### Effective Prompts
✅ **Good Prompts**:
- "Add a button that says 'Create Ticket' on the equipment page"
- "Fix the error when clicking the Add Equipment button"
- "Show me all database tables that exist"
- "Add 5 sample equipment items for testing"

❌ **Avoid**:
- Technical jargon
- Multiple features at once
- Vague descriptions
- Assumptions about implementation

### Common Commands
```markdown
# Fix errors
"The [page] shows an error. Please fix it so it loads correctly."

# Add features
"Add a [button/form/list] that [specific action]"

# Test with data
"Add sample data for [feature] so I can see how it looks"

# Mobile fixes
"Make [feature] work properly on mobile devices"
```

## 🐛 Known Issues

### Current Problems
1. **Import Path Issues** - Repository reorganization incomplete
2. **TypeScript Errors** - Some type mismatches
3. **Dashboard Data** - Shows hardcoded data instead of real
4. **Equipment Logs** - Table structure needs update

### Quick Fixes
- Login broken: "Fix authentication so users can log in"
- Page errors: "Fix import errors on [page name]"
- Missing data: "Make [feature] show real data from database"

## 🎯 Success Metrics
- All equipment tracked with maintenance history
- Work orders created and assigned
- Warranty expiration alerts functional
- Multi-location data properly isolated
- AI assistant provides helpful guidance

## 🔧 Development Workflow
1. Make changes in Lovable
2. Test functionality
3. Deploy to Lovable hosting
4. Changes sync to GitHub automatically
5. Document progress in PROGRESS.md

## 🤝 For AI Assistants

When helping with this project:
1. Use simple, non-technical language
2. Focus on business outcomes
3. Provide copy-paste ready prompts
4. Test suggestions are practical
5. Remember: no coding experience

Key Context:
- Owner runs tanning salons
- Needs to track equipment across locations
- Manage maintenance and vendors
- Coordinate technicians
- Ensure compliance and safety
