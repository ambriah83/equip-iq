# How to Run Supabase Migrations - Simple Guide

## What are migrations?
Migrations are SQL files that update your database structure (like adding new tables or fixing issues). Think of them as "update patches" for your database.

## Method 1: Using Supabase Dashboard (EASIEST) 🎯

1. **Go to your Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Select your project (equip-iq)

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run each migration file**
   - Click "New query"
   - Copy the contents of each migration file
   - Paste it into the SQL editor
   - Click "Run" (or press Ctrl+Enter)

4. **Run migrations in this order:**
   ```
   1. 20250112_add_rate_limiting.sql
   2. 20250112_fix_migration_issues.sql
   3. 20250112_create_user_invitations.sql
   ```

## Method 2: Using Supabase CLI (For developers)

### First-time setup:
```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
cd /mnt/c/Users/ambri/Projects/equip-iq
supabase link --project-ref gynvafivzdtdqojuuoit
```

### Run migrations:
```bash
# Push all migrations to your database
supabase db push

# Or reset database and apply all migrations (CAREFUL - this deletes all data!)
supabase db reset
```

## Method 3: Quick Copy-Paste Commands

If you want to do it via CLI right now, here are the commands:

```bash
# Navigate to your project
cd /mnt/c/Users/ambri/Projects/equip-iq

# Check if Supabase CLI is installed
supabase --version

# If not installed, install it:
npm install -g supabase

# Login (this will open a browser)
supabase login

# Link to your project
supabase link --project-ref gynvafivzdtdqojuuoit

# Run migrations
supabase db push
```

## Important Notes:

1. **Migrations run in order** - The filename dates determine the order
2. **Migrations are permanent** - Once run, they modify your database
3. **Test first** - If you have a staging environment, test there first
4. **Backup** - Supabase automatically backs up your database, but you can create a manual backup in the dashboard

## After Running Migrations:

1. **Test your Edge Functions** to make sure they still work
2. **Check the database tables** in Supabase Dashboard > Table Editor
3. **Grant super_admin permission** to yourself:
   - Go to SQL Editor
   - Run: `INSERT INTO public.user_permissions (user_id, permission) VALUES ('<YOUR_USER_ID>', 'super_admin');`
   - Replace `<YOUR_USER_ID>` with your actual user ID

## Troubleshooting:

- **"Table already exists" error**: This is OK - the migration is using IF NOT EXISTS
- **"Permission denied" error**: Make sure you're using the right project
- **Edge Functions not working**: Deploy them again after migrations

## Quick Health Check:
After migrations, run this SQL to check everything is OK:
```sql
-- Check if new tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('edge_function_rate_limits', 'user_invitations', 'user_permissions');

-- Should return 3 rows
```

That's it! Migrations are just SQL files that update your database structure. The easiest way is through the Supabase Dashboard.