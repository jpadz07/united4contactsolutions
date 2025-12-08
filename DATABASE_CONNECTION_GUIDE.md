# Database Connection & Data Flow Guide

## Overview

This guide explains how the database connection works and how data flows from the dashboard to the database and then to the landing page.

## Data Flow

```
Dashboard (Save) → API Route → Supabase Database → API Route → Landing Page
```

### Step-by-Step Flow

1. **Dashboard Save Action**
   - User makes changes in the dashboard
   - Clicks "Save" button
   - Dashboard sends POST request to `/api/content/[section]` with authentication token

2. **API Route Processing**
   - API route verifies authentication token
   - Validates Supabase connection
   - Saves data to Supabase using `upsert` (insert or update)
   - Returns success/error response

3. **Database Storage**
   - Data is stored in Supabase PostgreSQL database
   - Each section has its own table (header, hero, core_values, etc.)
   - `updated_at` timestamp is automatically updated

4. **Landing Page Load**
   - Landing page fetches data on mount via GET requests
   - API routes query Supabase and return data
   - Landing page displays the latest data from database

## Testing Database Connection

### Method 1: Dashboard Settings Tab

1. Log into the dashboard
2. Navigate to **Settings** tab
3. Click **"Test Connection"** button
4. Check the status indicator:
   - 🟢 Green = Connected successfully
   - 🔴 Red = Connection failed
   - 🟡 Yellow = Testing in progress

### Method 2: API Endpoint

Visit: `http://localhost:3000/api/test-connection`

Response examples:

**Success:**
```json
{
  "connected": true,
  "message": "Database connection successful",
  "env": {
    "hasUrl": true,
    "hasServiceKey": true,
    "hasAnonKey": true
  },
  "testQuery": "success"
}
```

**Failure:**
```json
{
  "connected": false,
  "error": "Database tables not found. Please run the schema.sql file in Supabase.",
  "details": "..."
}
```

## Verifying Data Flow

### Test 1: Save and Verify

1. **In Dashboard:**
   - Go to any section (e.g., Header)
   - Change the company name
   - Click "Save"
   - Should see: "Header saved successfully!"

2. **Check Database:**
   - Go to Supabase Dashboard
   - Navigate to Table Editor
   - Check the `header` table
   - Verify the `company_name` field was updated

3. **Check Landing Page:**
   - Open the landing page in a new tab
   - Refresh the page (F5)
   - Verify the company name matches what you saved

### Test 2: Real-time Update

1. Make a change in dashboard
2. Save it
3. Open landing page in another tab
4. Refresh the landing page
5. Changes should appear immediately

## Troubleshooting

### Error: "No authentication token provided"

**Cause:** Session expired or invalid

**Solution:**
- Log out and log back in
- Make sure you're accessing dashboard via the encrypted URL

### Error: "Database not configured"

**Cause:** Missing environment variables

**Solution:**
1. Check `.env.local` file exists
2. Verify these variables are set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Restart the development server after adding variables

### Error: "Database tables not found"

**Cause:** Database schema not created

**Solution:**
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/schema.sql`
4. Verify tables are created in Table Editor

### Error: "Failed to save to database"

**Cause:** Database connection issue or invalid data

**Solution:**
1. Test connection in Settings tab
2. Check Supabase dashboard for errors
3. Verify table structure matches expected schema
4. Check browser console for detailed error messages

### Landing Page Not Updating

**Cause:** Cache or data not loading

**Solution:**
1. Hard refresh landing page (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console for errors
3. Verify API routes are returning data:
   - Visit `http://localhost:3000/api/content/header`
   - Should return JSON data, not an error

## API Routes

All content API routes follow this pattern:

- **GET** `/api/content/[section]` - Fetch data (public, no auth required)
- **POST** `/api/content/[section]` - Save data (requires authentication)

Available sections:
- `/api/content/header`
- `/api/content/hero`
- `/api/content/core-values`
- `/api/content/about`
- `/api/content/services`
- `/api/content/team`
- `/api/content/projects`
- `/api/content/testimonials`

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

Key tables:
- `header` - Company name, tagline, logo
- `hero` - Hero section content
- `core_values` - Core values array
- `about` - About us content
- `services` - Services list
- `team` - Team members
- `projects` - Projects list
- `testimonials` - Testimonials

See `supabase/schema.sql` for full schema.

## Best Practices

1. **Always test connection** before making changes
2. **Save frequently** to avoid data loss
3. **Verify changes** on landing page after saving
4. **Check console** for errors if something doesn't work
5. **Use Settings tab** to monitor database status

## Support

If you encounter issues:
1. Check the Settings tab connection status
2. Review browser console for errors
3. Check Supabase dashboard for database errors
4. Verify environment variables are set correctly
5. Ensure database schema is up to date

