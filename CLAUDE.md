# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Documentation References

**ALWAYS start by reading these files in order:**
1. `AI_INSTRUCTIONS.md` - How to work with this codebase
2. `PROJECT_CONTEXT.md` - What this project is and current status
3. `PROGRESS.md` - Recent work and current priorities
4. `TROUBLESHOOTING.md` - Known issues and solutions

**After making changes, update:**
- `PROGRESS.md` - What was accomplished (with date)
- `PROMPTS.md` - Successful Lovable.dev commands
- `TROUBLESHOOTING.md` - New issues and fixes

## Essential Commands

```bash
npm run dev          # Start development server on http://localhost:8080
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build locally
```

## Core Architecture Patterns

### 1. Data Fetching Pattern
All resources use a consistent hook pattern wrapping Supabase:

```typescript
// Pattern: hooks/useResource.ts
const useResource = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('table_name')
      .select('*, related_table(*)')
      .order('name');
    // Handle error, transform data, update state
  };
  
  return { data, loading, error, create, update, delete, refetch };
};
```

This pattern is used in: `useEquipment`, `useLocations`, `useVendors`, `useRooms`, `useUsers`, etc.

### 2. Authentication & Session Management
- **Entry Point**: `App.tsx` manages global session state
- **Pattern**: Session checked on mount, auth state changes trigger re-renders
- **Protected Routes**: Components check session before rendering
- **Context**: Session data flows down via props or context

### 3. Permission System Architecture
- **Hierarchical Roles**: owner → admin → manager → staff → vendor/tech
- **Two-Layer Permissions**:
  1. Role-based defaults from `role_permissions` table
  2. User-specific overrides from `user_permissions` table
- **Safety-Critical Operations**: Special permissions for electrical, height work, etc.
- **Location-Based Access**: Users restricted to assigned locations via `user_location_access`

### 4. Component & State Patterns
- **UI Components**: All use shadcn/ui primitives (Radix UI + Tailwind)
- **Forms**: React Hook Form + Zod schemas for validation
- **Data Flow**: Hooks fetch data → Components display → Actions update via hooks
- **Error Handling**: Each hook manages its own loading/error states

### 5. Database Design Principles
- **Row Level Security (RLS)**: Every table has RLS policies
- **Soft Deletes**: Most tables use `deleted_at` instead of hard deletes
- **Audit Fields**: `created_at`, `updated_at`, `created_by`, `updated_by`
- **Relationships**: Extensive foreign keys with CASCADE rules
- **Naming**: Snake_case for database, camelCase in TypeScript

## Key Technical Decisions

### TypeScript Configuration
- **Path Alias**: `@/` maps to `./src/` for clean imports
- **Relaxed Strictness**: Allows faster development without type perfection
- **Type Generation**: Supabase types auto-generated in `integrations/supabase/types.ts`

### Supabase Integration
- **Client Location**: `src/integrations/supabase/client.ts`
- **Query Pattern**: Always use `.select()` with explicit fields
- **Error Handling**: Check for errors before using data
- **Realtime**: Available but not widely implemented yet

### Development Workflow
- **Platform**: Lovable.dev (AI-powered, no manual coding)
- **Target User**: Non-technical owner needs simple language
- **Testing**: Manual testing after each change
- **Deployment**: Automatic via Lovable platform

## Important Context

- **Industry**: Multi-location tanning salon equipment management
- **Scale**: Designed for franchise operations with many locations
- **Users**: Salon staff, managers, owners, and service technicians
- **Critical Features**: Equipment tracking, maintenance scheduling, vendor coordination

## Common Patterns to Follow

### Adding New Database Features
1. Check if table exists in migrations
2. Update TypeScript types if needed
3. Create/update hook following the established pattern
4. Build UI using existing component patterns
5. Test with real data

### Debugging Issues
1. Check browser console for errors
2. Verify Supabase RLS policies
3. Confirm user has proper permissions
4. Check that data exists in database
5. Review recent changes in git history

---
**Note**: This file documents stable architectural patterns. For current feature status, todo items, and specific component details, refer to the documentation files listed at the top.