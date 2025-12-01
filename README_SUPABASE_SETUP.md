# Supabase Setup Guide

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Name**: united4contactsolutions (or your preferred name)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is fine to start

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - keep this secret!)

## Step 3: Set Up Environment Variables

1. Create a `.env.local` file in your project root (copy from `.env.local.example`)
2. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**Important**: Never commit `.env.local` to Git! It's already in `.gitignore`.

## Step 4: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the SQL
5. Verify tables were created in **Table Editor**

## Step 5: Set Up File Storage (Optional - for images)

If you want to store uploaded images in Supabase Storage instead of base64:

1. Go to **Storage** in Supabase dashboard
2. Click "Create a new bucket"
3. Name it: `icons` (or `uploads`)
4. Make it **Public** (for public access)
5. Create policies:
   - **SELECT**: Allow public read access
   - **INSERT**: Restrict to authenticated users (or use service role)

## Step 6: Test the Connection

1. Start your dev server: `npm run dev`
2. Go to `/admin/dashboard`
3. Try saving some content
4. Check Supabase dashboard → **Table Editor** to see if data is saved

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and has all three variables
- Restart your dev server after adding environment variables

### "relation does not exist"
- Run the SQL schema in Supabase SQL Editor
- Check that all tables were created

### "permission denied"
- Check RLS policies in Supabase
- Make sure service_role key is set correctly

## Next Steps

- **File Storage**: Update API routes to upload images to Supabase Storage
- **Authentication**: Add proper admin authentication
- **Backup**: Set up database backups in Supabase dashboard
- **Monitoring**: Check Supabase logs for errors

## Database Schema Overview

- `header` - Company name and tagline
- `hero` - Hero section content
- `core_values` - Core values with icons
- `about` - About Us, Mission, Vision
- `services` - Services list with features
- `team` - Team members with skills and projects
- `projects` - Featured projects
- `testimonials` - Client testimonials

All tables have `updated_at` timestamps and support ordering where needed.

