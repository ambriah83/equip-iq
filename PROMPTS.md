# Lovable.dev Prompts That Work

**Last Updated**: 2025-01-27

This document contains tested prompts that work well with Lovable.dev for the EquipIQ project.

## 🚀 Getting Started Prompts

### Check Current State
```
Show me a list of all database tables that currently exist in Supabase.
```

```
Show me what pages are working and which ones have errors.
```

## 🔧 Fixing Issues

### Import/Path Errors
```
The [page name] page shows import errors. Please fix all the import paths so the page loads correctly. Don't delete any functionality.
```

```
Fix the error "Cannot find module" on the equipment page. Update the import paths to match the current file structure.
```

### Authentication Issues
```
The login is broken. Please fix the authentication so users can log in with their email and password.
```

```
When I try to register a new user, nothing happens. Please fix the registration process.
```

### Page Load Errors
```
The dashboard page shows a blank screen. Please fix any errors so it displays properly.
```

## 📝 Adding Features

### Buttons and Actions
```
Add a button that says "Create Ticket" on the equipment detail page. When clicked, it should open a form to report an issue with that equipment.
```

```
Add a "Delete" button next to each vendor in the vendor list. When clicked, ask for confirmation before deleting.
```

### Forms and Inputs
```
Add a search bar at the top of the equipment page that filters the equipment list as I type. It should search by equipment name and serial number.
```

```
Add a date picker to the equipment form for "Next Service Date" that doesn't allow selecting dates in the past.
```

### Lists and Tables
```
Show a list of all tickets on a new page called "Work Orders". Include columns for title, status, priority, and assigned to.
```

```
Add a "Recent Activity" section to the dashboard that shows the last 10 equipment updates.
```

## 📊 Working with Data

### Adding Sample Data
```
Add 5 sample equipment items with different statuses so I can see how the page looks with data.
```

```
Create 3 sample work tickets with different priorities and statuses for testing.
```

### Connecting Real Data
```
Make the dashboard statistics show real counts from the database instead of hardcoded numbers.
```

```
The equipment list is empty even though there's data in the database. Please make it show the actual equipment records.
```

## 🎨 UI/UX Improvements

### Mobile Responsiveness
```
The equipment cards don't display properly on mobile. Please make them stack vertically on small screens.
```

```
The sidebar menu doesn't work on mobile. Add a hamburger menu that opens and closes the sidebar.
```

### Visual Improvements
```
Add status colors to equipment cards: green for active, yellow for maintenance, red for inactive.
```

```
Make the priority badges on tickets stand out more: red for urgent, orange for high, yellow for medium, gray for low.
```

## 🗄️ Database Operations

### Adding Tables
```
Add a documents table to store equipment manuals and warranties with these fields:
- id (unique identifier)
- title (required)
- file_url
- equipment_id (links to equipment)
- document_type (manual, warranty, or other)
- uploaded_date
- uploaded_by_user_id

Don't delete any existing tables or data.
```

### Updating Tables
```
Add a "notes" field to the vendors table for storing additional vendor information. Keep all existing data.
```

### Creating Relationships
```
Link the tickets table to the equipment table so each ticket can be associated with a specific piece of equipment.
```

## 🔍 Search and Filter

### Basic Search
```
Add a working search bar to the locations page that filters by location name and address as the user types.
```

### Advanced Filters
```
Add filter dropdowns to the equipment page for:
- Status (active, maintenance, inactive)
- Location (list of all locations)
- Equipment Type (list of all types)

The filters should work together to show only matching equipment.
```

## 📱 Complete Feature Examples

### Work Order System
```
Create a work order system with these features:
1. A "Create Work Order" button on the equipment detail page
2. A form with fields for title, description, priority, and assigned user
3. Save the work order to the tickets table
4. Show a success message after creating
5. Redirect to a list of all work orders
```

### Equipment Check-In
```
Add an equipment check-in feature:
1. Add a "Check In" button on equipment cards
2. When clicked, show a form with:
   - Current status dropdown
   - Notes text area
   - Photo upload option
3. Save this as a new equipment log entry
4. Update the equipment's last service date
5. Show success message
```

## ⚠️ Important Reminders

### Always Include
- "Don't delete any existing data"
- "Keep all existing functionality"
- "Test that [related feature] still works"

### Be Specific About
- Button text and placement
- What happens when clicked
- Success/error messages
- Where to redirect after actions

### Avoid
- Multiple features in one prompt
- Technical implementation details
- Assumptions about the code structure

## 💡 Debugging Prompts

### When Something Breaks
```
After the last change, [describe what broke]. Please fix it so [feature] works again like it did before.
```

### When You're Not Sure
```
Show me how the [feature name] currently works and what database tables it uses.
```

### Getting Help
```
I'm trying to [goal]. What's the best way to implement this given the current structure?
```

## 📚 Complex Operations

### Multi-Step Features
Break them down:
```
Step 1: Add a "Manage Contacts" button to the vendor detail page.
```
Then after that works:
```
Step 2: When the "Manage Contacts" button is clicked, show a list of all contacts for this vendor.
```
Then:
```
Step 3: Add an "Add Contact" button that opens a form to create new vendor contacts.
```

### Testing Workflows
```
Add a complete test workflow:
1. Create a test user with email "test@example.com"
2. Create a test location called "Test Salon"
3. Add 3 test equipment items to that location
4. Create a test ticket for one equipment item
5. Show me the results on the dashboard
```

## 🎯 Best Practices

1. **One Thing at a Time**: Focus on single features
2. **Test After Each Change**: Verify nothing broke
3. **Use Business Language**: Avoid technical terms
4. **Provide Examples**: "Like Amazon's search bar"
5. **Specify Outcomes**: What should happen after actions

## 📝 Notes

- These prompts have been tested and work with Lovable.dev
- Adjust the specific details to match your needs
- If a prompt doesn't work, try breaking it into smaller steps
- Save prompts that work well for future use
