# EquipIQ Troubleshooting Guide

**Last Updated**: 2025-01-27

Common issues and their solutions for the EquipIQ project.

## 🔴 Critical Issues

### Cannot Log In
**Symptoms**: Login button doesn't work, stays on login page, no error message

**Solutions**:
```
Fix authentication so users can log in with email and password. Check that the Supabase auth is properly connected.
```

**Check**:
- Supabase URL and anon key are correct
- User exists in database
- Password is correct

### Blank/White Screen
**Symptoms**: Page loads but shows nothing

**Solutions**:
```
The [page name] shows a blank screen. Fix any JavaScript errors preventing the page from rendering.
```

**Common Causes**:
- Import path errors
- Missing components
- TypeScript errors
- Database connection issues

## 🟡 Common Issues

### "Cannot Find Module" Errors
**Symptoms**: Red error about missing modules or imports

**Solution**:
```
Fix all import path errors on [page name]. Update the paths to match the current file structure without deleting any functionality.
```

**Manual Fix**:
- Check if file exists at specified path
- Update from `@/components/` to correct path
- Ensure all referenced files exist

### Data Not Showing
**Symptoms**: Lists are empty, counts show 0, no data displayed

**Solutions**:
```
The [feature] list is empty even though there's data in the database. Make it show the actual data from the database.
```

**Check**:
- RLS policies allow data access
- User has correct permissions
- Query includes all needed fields
- Component is using real data, not mock

### Form Doesn't Submit
**Symptoms**: Click submit but nothing happens

**Solution**:
```
The [form name] form doesn't submit when I click the button. Fix the form submission and show a success message when it works.
```

**Common Causes**:
- Validation errors not shown
- Missing required fields
- Database constraints
- No error handling

### Mobile Layout Broken
**Symptoms**: Overlapping elements, text cut off, unusable on phone

**Solution**:
```
Fix the mobile layout for [page/component]. Elements should stack vertically and be fully visible on small screens.
```

## 🔧 Specific Feature Issues

### Equipment Management

**Can't Add Equipment**:
```
The Add Equipment button doesn't work. Fix it so clicking the button opens the form and successfully saves new equipment.
```

**Equipment Status Wrong**:
```
Equipment shows as "offline" but that's not a valid status. Change all "offline" equipment to "inactive" status.
```

### Location Management

**Can't See All Locations**:
```
Some locations are missing from the list. Make sure users can see all locations they have access to based on their role.
```

**Room Assignment Issues**:
```
Can't assign equipment to rooms. Fix the room dropdown to show all rooms for the selected location.
```

### Vendor Management

**Vendor Contacts Not Saving**:
```
The vendor contacts aren't saving. Fix the form to properly save multiple contacts per vendor with their roles.
```

### Work Orders (Tickets)

**No Ticket UI**:
```
Create a page to view all work orders. Include a list with columns for title, status, priority, and assigned user.
```

**Can't Create Tickets**:
```
Add a "Report Issue" button on the equipment detail page that opens a form to create a new ticket for that equipment.
```

## 🗄️ Database Issues

### Table Doesn't Exist
**Error**: "relation does not exist"

**Solution**:
```
Create the [table_name] table with these fields: [list fields]. Don't delete any existing tables.
```

### Permission Denied
**Error**: "permission denied for table"

**Solution**:
```
Fix the RLS policies for [table_name] so users can [read/write] based on their role and location access.
```

### Foreign Key Constraint
**Error**: "violates foreign key constraint"

**Solution**:
```
The [field] must reference a valid [related_table] record. Add a dropdown to select from existing options.
```

## 🎨 UI/UX Issues

### Colors/Styling Missing
**Symptoms**: Everything looks plain, no colors

**Solution**:
```
Add status colors: green for active, yellow for maintenance, red for inactive/urgent. Use Tailwind CSS classes.
```

### Icons Not Showing
**Symptoms**: Boxes or missing icons

**Solution**:
```
The icons aren't displaying. Make sure Lucide React icons are properly imported and used.
```

### Responsive Issues
**Symptoms**: Horizontal scroll, cut-off content

**Solution**:
```
Fix responsive layout issues. Use Tailwind's responsive classes (sm:, md:, lg:) to adjust layouts for different screen sizes.
```

## 💡 Prevention Tips

### Before Making Changes
1. Note what's currently working
2. Test login first
3. Check one page at a time

### When Adding Features
1. Start with the simplest version
2. Test after each step
3. Add complexity gradually

### When Issues Occur
1. Check browser console for errors
2. Try logging out and back in
3. Check if data exists in database
4. Verify permissions/access

## 🚨 Emergency Fixes

### Everything Broken
```
The app won't load at all. Please fix the critical errors preventing the application from starting.
```

### Lost All Data
```
The data isn't showing anywhere. Check the database connection and RLS policies to restore data visibility.
```

### Can't Deploy
```
The build is failing. Fix any TypeScript or build errors so the application can deploy successfully.
```

## 📝 Debugging Prompts

### Understand Current State
```
Show me what's currently broken and what error messages are appearing.
```

### Trace the Issue
```
Explain how [feature] is supposed to work and what might be preventing it from working correctly.
```

### Get Recommendations
```
What's the best way to fix [specific issue] without breaking other features?
```

## 🔄 Recovery Steps

1. **If Login Breaks**:
   - First try: "Fix authentication"
   - If persists: "Reset auth to basic email/password login"

2. **If Data Disappears**:
   - Check: "Show me the current RLS policies"
   - Fix: "Update RLS policies to allow authenticated users to see their data"

3. **If UI Breaks**:
   - Isolate: "Show only the [component] without other page elements"
   - Fix: "Rebuild the [component] with basic functionality"

4. **If Nothing Works**:
   - Revert: "Go back to the last working version"
   - Or: "Show me the git history to find when this last worked"

## ⚡ Quick Fixes

| Issue | Quick Fix |
|-------|-----------|
| Import errors | Update all import paths to match current structure |
| Empty lists | Check RLS policies and data queries |
| Form won't submit | Add error handling and validation messages |
| Mobile broken | Add responsive Tailwind classes |
| Missing data | Verify database connection and permissions |
| Styling gone | Re-import Tailwind and component styles |

## 📞 When to Ask for Help

If these solutions don't work:
1. Document exactly what you tried
2. Note any error messages
3. Describe what should happen
4. Ask: "I tried [solutions] but [issue] still happens. What else can I try?"

Remember: Most issues are fixable with the right prompt!
