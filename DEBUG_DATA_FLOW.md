# Debug Guide: Header and Hero Data Flow

## Issue
Data saves to database but doesn't appear on landing page.

## Debugging Steps

1. **Check Browser Console**
   - Open landing page
   - Open Developer Tools (F12)
   - Check Console tab for:
     - "Header API response:" - Should show the data from API
     - "Header data updated:" - Should show what was set in state
     - "Hero API response:" - Should show the data from API
     - "Hero data updated:" - Should show what was set in state

2. **Check Network Tab**
   - Open Developer Tools → Network tab
   - Refresh the page
   - Look for requests to `/api/content/header` and `/api/content/hero`
   - Click on each request
   - Check the "Response" tab to see what data is returned
   - Verify the data matches what's in the database

3. **Check Database Directly**
   - Go to Supabase Dashboard
   - Navigate to Table Editor
   - Check `header` table - verify data exists
   - Check `hero` table - verify data exists
   - Note the `updated_at` timestamp

4. **Test API Directly**
   - Visit: `http://localhost:3000/api/content/header`
   - Should return JSON with your data
   - Visit: `http://localhost:3000/api/content/hero`
   - Should return JSON with your data

5. **Check State Updates**
   - In browser console, type: `window.__REACT_DEVTOOLS_GLOBAL_HOOK__`
   - Use React DevTools to inspect component state
   - Check if `headerData` and `heroData` state values match database

## Common Issues

### Issue 1: API Returns Null
- **Symptom**: Console shows "Header data is null"
- **Cause**: No data in database or query failed
- **Fix**: Save data from dashboard first

### Issue 2: Data Not Updating State
- **Symptom**: API returns data but state doesn't update
- **Cause**: Condition check too strict
- **Fix**: Check console logs to see what condition failed

### Issue 3: Cached Data
- **Symptom**: Old data appears even after saving
- **Cause**: Browser or Next.js cache
- **Fix**: Hard refresh (Ctrl+Shift+R) or clear cache

### Issue 4: Wrong Field Names
- **Symptom**: Data exists but wrong fields displayed
- **Cause**: Database field names don't match code
- **Fix**: Check database schema matches code expectations

## Expected Console Output

When working correctly, you should see:
```
Header API response: { company_name: "...", tagline: "...", logo: "..." }
Header data updated: { company_name: "...", tagline: "...", logo: "..." }
Hero API response: { headline: "...", subheadline: "...", ... }
Hero data updated: { headline: "...", subheadline: "...", ... }
```

## Quick Fix

If data is in database but not showing:
1. Open browser console
2. Type: `location.reload(true)` and press Enter
3. Check console logs
4. Verify API responses match database

