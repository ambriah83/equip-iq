# EquipIQ Security Fix Guide

## Issues Found and Fixed

### 1. **Missing `user_permissions` table**
- Your RLS policies referenced a table that didn't exist
- Created the table with proper structure and RLS policies

### 2. **No way for users to get access**
- Added automatic location access for new users
- Created permission checking functions

### 3. **Conflicting schemas**
- You have two migration files with different schemas
- The app uses the first schema (equipment/locations)
- The MVP schema should be removed

## Steps to Apply the Fix

### 1. Remove the conflicting MVP migration
```bash
rm supabase/migrations/20250710_mvp_schema.sql
```

### 2. Get your Supabase user ID
1. Go to your Supabase Dashboard
2. Navigate to Authentication → Users
3. Find your user and copy the ID

### 3. Update the migration file
Edit `supabase/migrations/20250712_fix_security_issues.sql`:
1. Find the section with `YOUR-USER-ID-HERE` (around line 47)
2. Uncomment the INSERT statement
3. Replace `YOUR-USER-ID-HERE` with your actual user ID

### 4. Run the migration
```bash
cd /mnt/c/Users/ambri/Projects/equip-iq
npx supabase db push
```

### 5. Verify the fix
Test that:
- You can log in
- You can see at least one location
- The app doesn't throw permission errors

## Additional Security Recommendations

### 1. **Set up proper admin users**
```sql
-- Add more admins as needed
INSERT INTO public.user_permissions (user_id, permission, is_allowed)
VALUES 
  ('admin-user-id', 'super_admin', true),
  ('admin-user-id', 'can_access_restricted_areas', true);
```

### 2. **Review location access**
```sql
-- Grant users access to specific locations
INSERT INTO public.user_location_access (user_id, location_id, access_level)
VALUES 
  ('user-id', 'location-id', 'write');
```

### 3. **Monitor access**
Use the `user_access_summary` view to see who has access to what:
```sql
SELECT * FROM public.user_access_summary;
```

## Emergency Access Recovery

If you get locked out:
1. Go to Supabase SQL Editor
2. Run as postgres/service role:
```sql
-- Grant yourself super admin
INSERT INTO public.user_permissions (user_id, permission, is_allowed)
VALUES 
  ('your-user-id', 'super_admin', true)
ON CONFLICT (user_id, permission) 
DO UPDATE SET is_allowed = true;

-- Grant yourself location access
INSERT INTO public.user_location_access (user_id, location_id, access_level)
SELECT 
  'your-user-id',
  id,
  'admin'
FROM public.locations;
```

## Testing Checklist

- [ ] Can create new users
- [ ] New users get automatic access to at least one location
- [ ] Admins can manage all locations
- [ ] Regular users can only see their assigned locations
- [ ] Equipment visibility follows location access
- [ ] User permissions are properly enforced

## Next Steps

1. Consider implementing role-based access control (RBAC) with predefined roles
2. Add audit logging for security-sensitive actions
3. Implement location-specific admin roles
4. Add UI for managing user permissions

If you have any issues, check:
- Supabase logs for RLS policy violations
- Browser console for permission errors
- The `user_access_summary` view for access overview