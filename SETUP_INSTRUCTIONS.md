# Supabase Setup Instructions

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Fill in project details:
   - Name: `united4contactsolutions`
   - Database Password: (create a strong password - save it!)
   - Region: Choose closest to you
   - Plan: Free tier is fine

### 3. Get Your API Keys

1. In Supabase dashboard → **Settings** → **API**
2. Copy these values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")
   - **service_role** key (under "Project API keys" - keep this secret!)

### 4. Create Environment File

Create a file named `.env.local` in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Important**: Replace the placeholder values with your actual Supabase credentials!

### 5. Create Database Tables

1. In Supabase dashboard → **SQL Editor**
2. Click "New Query"
3. Open `supabase/schema.sql` from this project
4. Copy ALL the SQL code
5. Paste into Supabase SQL Editor
6. Click "Run" (or press Ctrl+Enter)
7. Verify tables were created in **Table Editor**

### 6. Test the Setup

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Go to: `http://localhost:3000/admin/dashboard`

3. Try editing and saving some content

4. Check Supabase **Table Editor** to see if data is saved

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists in project root
- Check that all 3 variables are set
- Restart dev server: `npm run dev`

### "relation does not exist"
- Run the SQL schema in Supabase SQL Editor
- Check **Table Editor** to verify tables exist

### "permission denied"
- Check that service_role key is correct
- Verify RLS policies in Supabase dashboard

### Data not saving
- Check browser console for errors
- Check Supabase dashboard → **Logs** for API errors
- Verify API routes are working: check Network tab in browser dev tools

## Next Steps

- ✅ Database is set up
- ✅ API routes are ready
- ✅ Dashboard is connected
- 🔄 **Optional**: Set up Supabase Storage for image uploads (see README_SUPABASE_SETUP.md)

## File Structure

```
app/
  api/
    content/          # API routes for CRUD operations
      header/
      hero/
      core-values/
      about/
      services/
      team/
      projects/
      testimonials/
  admin/
    dashboard/        # Admin dashboard page

lib/
  supabase/
    client.ts         # Client-side Supabase client
    server.ts         # Server-side Supabase client (admin)
  types/
    database.ts       # TypeScript types

supabase/
  schema.sql         # Database schema to run in Supabase
```

## Support

If you encounter issues:
1. Check Supabase dashboard → **Logs** for errors
2. Check browser console for client-side errors
3. Verify environment variables are set correctly
4. Make sure database tables were created successfully



